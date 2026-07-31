(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_ALGEBRA_VALIDATOR = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "mathAlgebraValidatorV1";
  const DEFAULT_NUMERIC_TOLERANCE = 1e-10;
  const LIMITS = Object.freeze({
    maxInputLength: 500,
    maxTokens: 256,
    maxDepth: 32,
    maxExponent: 12,
    maxIntegerDigits: 12,
    maxSquareFactorChecks: 1000000,
  });
  const STATUSES = Object.freeze({
    EQUIVALENT: "EQUIVALENT",
    NOT_EQUIVALENT: "NOT_EQUIVALENT",
    DOMAIN_MISMATCH: "DOMAIN_MISMATCH",
    FULLY_FACTORED: "FULLY_FACTORED",
    EQUIVALENT_NOT_FULLY_FACTORED: "EQUIVALENT_NOT_FULLY_FACTORED",
    CORRECT: "CORRECT",
    INCORRECT: "INCORRECT",
    ALLOWED: "ALLOWED",
    EXCLUDED: "EXCLUDED",
    VALID_STEP: "VALID_STEP",
    INVALID_STEP: "INVALID_STEP",
    REVIEW_REQUIRED: "REVIEW_REQUIRED",
    UNSUPPORTED_EXPRESSION: "UNSUPPORTED_EXPRESSION",
    INVALID_INPUT: "INVALID_INPUT",
  });

  class AlgebraError extends Error {
    constructor(code, message) {
      super(message);
      this.name = "AlgebraError";
      this.code = code;
    }
  }

  function unsupported(message) {
    throw new AlgebraError(STATUSES.UNSUPPORTED_EXPRESSION, message);
  }

  function invalid(message) {
    throw new AlgebraError(STATUSES.INVALID_INPUT, message);
  }

  function reviewRequired(message) {
    throw new AlgebraError(STATUSES.REVIEW_REQUIRED, message);
  }

  function absBigInt(value) {
    return value < 0n ? -value : value;
  }

  function gcdBigInt(left, right) {
    let a = absBigInt(left);
    let b = absBigInt(right);
    while (b) {
      const remainder = a % b;
      a = b;
      b = remainder;
    }
    return a || 1n;
  }

  function lcmBigInt(left, right) {
    if (!left || !right) return 0n;
    return absBigInt((left / gcdBigInt(left, right)) * right);
  }

  function rational(numerator, denominator = 1n) {
    let n = BigInt(numerator);
    let d = BigInt(denominator);
    if (d === 0n) invalid("Division by zero");
    if (d < 0n) {
      n = -n;
      d = -d;
    }
    if (n === 0n) return Object.freeze({ n: 0n, d: 1n });
    const divisor = gcdBigInt(n, d);
    return Object.freeze({ n: n / divisor, d: d / divisor });
  }

  function addRational(left, right) {
    return rational((left.n * right.d) + (right.n * left.d), left.d * right.d);
  }

  function negateRational(value) {
    return rational(-value.n, value.d);
  }

  function subtractRational(left, right) {
    return addRational(left, negateRational(right));
  }

  function multiplyRational(left, right) {
    return rational(left.n * right.n, left.d * right.d);
  }

  function divideRational(left, right) {
    if (right.n === 0n) invalid("Division by zero");
    return rational(left.n * right.d, left.d * right.n);
  }

  function equalRational(left, right) {
    return left.n === right.n && left.d === right.d;
  }

  function isZeroRational(value) {
    return value.n === 0n;
  }

  function rationalString(value) {
    return value.d === 1n ? String(value.n) : `${value.n}/${value.d}`;
  }

  function parseNumericLiteral(text) {
    const value = String(text);
    if (!/^\d+(?:\.\d+)?$/.test(value)) invalid("Invalid numeric literal");
    const [whole, fractional = ""] = value.split(".");
    const digits = `${whole}${fractional}`.replace(/^0+(?=\d)/, "");
    if (digits.length > LIMITS.maxIntegerDigits) invalid("Numeric literal is too large");
    const denominator = 10n ** BigInt(fractional.length);
    return rational(BigInt(`${whole}${fractional}` || "0"), denominator);
  }

  function integerSquareRoot(value) {
    if (value < 0n) invalid("Negative integer square root");
    if (value < 2n) return value;
    let left = 1n;
    let right = value;
    while (left <= right) {
      const middle = (left + right) >> 1n;
      const square = middle * middle;
      if (square === value) return middle;
      if (square < value) left = middle + 1n;
      else right = middle - 1n;
    }
    return right;
  }

  function isPerfectSquare(value) {
    if (value < 0n) return false;
    const rootValue = integerSquareRoot(value);
    return rootValue * rootValue === value;
  }

  function squareFreeDecompose(value) {
    let remaining = BigInt(value);
    if (remaining <= 0n) unsupported("Only positive real radicals are supported");
    let outside = 1n;
    let divisor = 2n;
    let checks = 0;
    while ((divisor * divisor) <= remaining) {
      checks += 1;
      if (checks > LIMITS.maxSquareFactorChecks) unsupported("Radicand is too complex");
      const square = divisor * divisor;
      while (remaining % square === 0n) {
        outside *= divisor;
        remaining /= square;
      }
      divisor += 1n;
    }
    return { outside, radicand: remaining };
  }

  function coefficient(entries = []) {
    const terms = new Map();
    entries.forEach(([radicand, value]) => {
      const key = String(radicand);
      const current = terms.get(key) || rational(0n);
      const next = addRational(current, value);
      if (isZeroRational(next)) terms.delete(key);
      else terms.set(key, next);
    });
    return terms;
  }

  function rationalCoefficient(value) {
    return isZeroRational(value) ? new Map() : coefficient([["1", value]]);
  }

  function cloneCoefficient(value) {
    return coefficient([...value.entries()]);
  }

  function addCoefficient(left, right) {
    return coefficient([...left.entries(), ...right.entries()]);
  }

  function negateCoefficient(value) {
    return coefficient([...value.entries()].map(([key, item]) => [key, negateRational(item)]));
  }

  function subtractCoefficient(left, right) {
    return addCoefficient(left, negateCoefficient(right));
  }

  function multiplyRadicalTerms(leftRadicand, rightRadicand) {
    const a = BigInt(leftRadicand);
    const b = BigInt(rightRadicand);
    const shared = gcdBigInt(a, b);
    return {
      outside: shared,
      radicand: (a / shared) * (b / shared),
    };
  }

  function multiplyCoefficient(left, right) {
    const entries = [];
    left.forEach((leftValue, leftRadicand) => {
      right.forEach((rightValue, rightRadicand) => {
        const product = multiplyRadicalTerms(leftRadicand, rightRadicand);
        entries.push([
          String(product.radicand),
          multiplyRational(
            multiplyRational(leftValue, rightValue),
            rational(product.outside)
          ),
        ]);
      });
    });
    return coefficient(entries);
  }

  function coefficientIsZero(value) {
    return value.size === 0;
  }

  function coefficientIsRational(value) {
    return [...value.keys()].every((key) => key === "1");
  }

  function coefficientRationalValue(value) {
    if (!coefficientIsRational(value)) return null;
    return value.get("1") || rational(0n);
  }

  function equalCoefficient(left, right) {
    const difference = subtractCoefficient(left, right);
    return coefficientIsZero(difference);
  }

  function inverseCoefficient(value) {
    const entries = [...value.entries()];
    if (entries.length === 0) invalid("Division by zero");
    if (entries.length === 1) {
      const [radicandText, scalar] = entries[0];
      const radicand = BigInt(radicandText);
      return coefficient([[
        radicandText,
        divideRational(rational(1n), multiplyRational(scalar, rational(radicand))),
      ]]);
    }
    if (entries.length === 2 && value.has("1")) {
      const radicalEntry = entries.find(([key]) => key !== "1");
      const rationalPart = value.get("1");
      const [radicandText, radicalPart] = radicalEntry;
      const radicand = rational(BigInt(radicandText));
      const denominator = subtractRational(
        multiplyRational(rationalPart, rationalPart),
        multiplyRational(multiplyRational(radicalPart, radicalPart), radicand)
      );
      if (isZeroRational(denominator)) invalid("Division by zero");
      return coefficient([
        ["1", divideRational(rationalPart, denominator)],
        [radicandText, divideRational(negateRational(radicalPart), denominator)],
      ]);
    }
    unsupported("Division by this radical sum is not supported");
  }

  function sqrtRational(value) {
    if (value.n < 0n) unsupported("Complex radicals are not supported");
    if (value.n === 0n) return new Map();
    const combined = value.n * value.d;
    if (String(combined).length > LIMITS.maxIntegerDigits * 2) unsupported("Radicand is too large");
    const decomposed = squareFreeDecompose(combined);
    return coefficient([[
      String(decomposed.radicand),
      rational(decomposed.outside, value.d),
    ]]);
  }

  function coefficientApproximation(value) {
    let result = 0;
    value.forEach((scalar, radicandText) => {
      result += (Number(scalar.n) / Number(scalar.d)) * Math.sqrt(Number(radicandText));
    });
    return result;
  }

  function coefficientCanonical(value) {
    if (value.size === 0) return "0";
    return [...value.entries()]
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([radicand, scalar]) => (
        radicand === "1"
          ? rationalString(scalar)
          : `${rationalString(scalar)}*sqrt(${radicand})`
      ))
      .join("+")
      .replace(/\+\-/g, "-");
  }

  function monomialFromVariable(variable) {
    return Object.freeze({ [variable]: 1 });
  }

  function monomialKey(monomial = {}) {
    return Object.keys(monomial)
      .filter((variable) => monomial[variable])
      .sort()
      .map((variable) => `${variable}^${monomial[variable]}`)
      .join("*");
  }

  function monomialFromKey(key) {
    if (!key) return {};
    return Object.fromEntries(key.split("*").map((part) => {
      const [variable, exponent] = part.split("^");
      return [variable, Number(exponent)];
    }));
  }

  function multiplyMonomialKeys(leftKey, rightKey) {
    const result = monomialFromKey(leftKey);
    Object.entries(monomialFromKey(rightKey)).forEach(([variable, exponent]) => {
      result[variable] = (result[variable] || 0) + exponent;
    });
    return monomialKey(result);
  }

  function polynomial(entries = []) {
    const terms = new Map();
    entries.forEach(([key, value]) => {
      const current = terms.get(key) || new Map();
      const next = addCoefficient(current, value);
      if (coefficientIsZero(next)) terms.delete(key);
      else terms.set(key, next);
    });
    return terms;
  }

  function constantPolynomial(value) {
    return coefficientIsZero(value) ? new Map() : polynomial([["", value]]);
  }

  function variablePolynomial(variable) {
    return polynomial([[monomialKey(monomialFromVariable(variable)), rationalCoefficient(rational(1n))]]);
  }

  function addPolynomial(left, right) {
    return polynomial([...left.entries(), ...right.entries()]);
  }

  function negatePolynomial(value) {
    return polynomial([...value.entries()].map(([key, item]) => [key, negateCoefficient(item)]));
  }

  function subtractPolynomial(left, right) {
    return addPolynomial(left, negatePolynomial(right));
  }

  function multiplyPolynomial(left, right) {
    const entries = [];
    left.forEach((leftValue, leftKey) => {
      right.forEach((rightValue, rightKey) => {
        entries.push([
          multiplyMonomialKeys(leftKey, rightKey),
          multiplyCoefficient(leftValue, rightValue),
        ]);
      });
    });
    return polynomial(entries);
  }

  function powerPolynomial(value, exponent) {
    if (!Number.isInteger(exponent) || exponent < 0 || exponent > LIMITS.maxExponent) {
      unsupported("Only small non-negative integer exponents are supported");
    }
    let result = constantPolynomial(rationalCoefficient(rational(1n)));
    let base = value;
    let power = exponent;
    while (power > 0) {
      if (power % 2 === 1) result = multiplyPolynomial(result, base);
      power = Math.floor(power / 2);
      if (power) base = multiplyPolynomial(base, base);
    }
    return result;
  }

  function polynomialIsConstant(value) {
    return [...value.keys()].every((key) => key === "");
  }

  function polynomialConstant(value) {
    if (!polynomialIsConstant(value)) return null;
    return value.get("") || new Map();
  }

  function dividePolynomial(left, right) {
    const divisor = polynomialConstant(right);
    if (divisor === null) unsupported("Division by a variable expression requires a rational-function validator");
    return polynomial([...left.entries()].map(([key, item]) => [
      key,
      multiplyCoefficient(item, inverseCoefficient(divisor)),
    ]));
  }

  function equalPolynomial(left, right) {
    return subtractPolynomial(left, right).size === 0;
  }

  function polynomialCanonical(value) {
    if (value.size === 0) return "0";
    return [...value.entries()]
      .sort(([leftKey], [rightKey]) => {
        const leftDegree = Object.values(monomialFromKey(leftKey)).reduce((sum, item) => sum + item, 0);
        const rightDegree = Object.values(monomialFromKey(rightKey)).reduce((sum, item) => sum + item, 0);
        return rightDegree - leftDegree || leftKey.localeCompare(rightKey);
      })
      .map(([key, item]) => `${key || "1"}:${coefficientCanonical(item)}`)
      .join("|");
  }

  function normalizeSource(value) {
    const source = String(value ?? "");
    if (!source.trim()) invalid("Expression is empty");
    if (source.length > LIMITS.maxInputLength) invalid("Expression is too long");
    return source
      .replace(/²/g, "^2")
      .replace(/³/g, "^3")
      .normalize("NFKC")
      .replace(/[−–—]/g, "-")
      .replace(/[×·]/g, "*")
      .replace(/÷/g, "/");
  }

  function tokenize(value) {
    const source = normalizeSource(value);
    const tokens = [];
    let index = 0;
    while (index < source.length) {
      const character = source[index];
      if (/\s/.test(character)) {
        index += 1;
        continue;
      }
      if (/\d|\./.test(character)) {
        const match = source.slice(index).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);
        if (!match) invalid("Invalid number");
        const text = match[0].startsWith(".") ? `0${match[0]}` : match[0];
        tokens.push({ type: "NUMBER", value: text });
        index += match[0].length;
        continue;
      }
      if (/[A-Za-z]/.test(character)) {
        const match = source.slice(index).match(/^[A-Za-z]+/)[0];
        if (match.toLowerCase() === "sqrt") tokens.push({ type: "SQRT", value: match });
        else if (match.length === 1) tokens.push({ type: "IDENTIFIER", value: match.toLowerCase() });
        else unsupported(`Unsupported identifier: ${match}`);
        index += match.length;
        continue;
      }
      const tokenTypes = {
        "+": "PLUS",
        "-": "MINUS",
        "*": "MULTIPLY",
        "/": "DIVIDE",
        "^": "POWER",
        "(": "LPAREN",
        ")": "RPAREN",
        "√": "SQRT",
        "±": "PLUS_MINUS",
      };
      const type = tokenTypes[character];
      if (!type) invalid(`Blocked character: ${character}`);
      tokens.push({ type, value: character });
      index += 1;
      if (tokens.length > LIMITS.maxTokens) invalid("Expression has too many tokens");
    }
    tokens.push({ type: "EOF", value: "" });
    return tokens;
  }

  class Parser {
    constructor(source) {
      this.tokens = tokenize(source);
      this.index = 0;
      this.depth = 0;
    }

    current() {
      return this.tokens[this.index];
    }

    consume(type) {
      if (this.current().type !== type) invalid(`Expected ${type}`);
      const token = this.current();
      this.index += 1;
      return token;
    }

    match(type) {
      if (this.current().type !== type) return false;
      this.index += 1;
      return true;
    }

    parse() {
      const result = this.parseAdditive();
      if (this.current().type === "PLUS_MINUS") unsupported("± is supported only by the solution-set parser");
      if (this.current().type !== "EOF") invalid(`Unexpected token: ${this.current().value}`);
      return result;
    }

    parseAdditive() {
      let result = this.parseProduct();
      while (["PLUS", "MINUS"].includes(this.current().type)) {
        const operator = this.current().type;
        this.index += 1;
        const right = this.parseProduct();
        const poly = operator === "PLUS"
          ? addPolynomial(result.poly, right.poly)
          : subtractPolynomial(result.poly, right.poly);
        result = {
          poly,
          ast: { type: "binary", operator: operator === "PLUS" ? "+" : "-", left: result.ast, right: right.ast, poly },
        };
      }
      return result;
    }

    beginsImplicitProduct() {
      return ["NUMBER", "IDENTIFIER", "LPAREN", "SQRT"].includes(this.current().type);
    }

    parseProduct() {
      let result = this.parseUnary();
      while (["MULTIPLY", "DIVIDE"].includes(this.current().type) || this.beginsImplicitProduct()) {
        const implicit = this.beginsImplicitProduct();
        const operator = implicit ? "MULTIPLY" : this.current().type;
        if (!implicit) this.index += 1;
        const right = this.parseUnary();
        const poly = operator === "MULTIPLY"
          ? multiplyPolynomial(result.poly, right.poly)
          : dividePolynomial(result.poly, right.poly);
        result = {
          poly,
          ast: {
            type: "binary",
            operator: operator === "MULTIPLY" ? "*" : "/",
            implicit,
            left: result.ast,
            right: right.ast,
            poly,
          },
        };
      }
      return result;
    }

    parseUnary() {
      if (this.match("PLUS")) return this.parseUnary();
      if (this.match("MINUS")) {
        const argument = this.parseUnary();
        const poly = negatePolynomial(argument.poly);
        return { poly, ast: { type: "unary", operator: "-", argument: argument.ast, poly } };
      }
      return this.parsePower();
    }

    parsePower() {
      let result = this.parsePrimary();
      if (this.match("POWER")) {
        const exponentToken = this.consume("NUMBER");
        if (!/^\d+$/.test(exponentToken.value)) unsupported("Exponent must be an integer");
        const exponent = Number(exponentToken.value);
        const poly = powerPolynomial(result.poly, exponent);
        result = {
          poly,
          ast: { type: "power", base: result.ast, exponent, poly },
        };
      }
      return result;
    }

    parsePrimary() {
      const token = this.current();
      if (token.type === "NUMBER") {
        this.index += 1;
        const value = parseNumericLiteral(token.value);
        const poly = constantPolynomial(rationalCoefficient(value));
        return { poly, ast: { type: "number", value, poly } };
      }
      if (token.type === "IDENTIFIER") {
        this.index += 1;
        const poly = variablePolynomial(token.value);
        return { poly, ast: { type: "variable", name: token.value, poly } };
      }
      if (token.type === "LPAREN") {
        this.index += 1;
        this.depth += 1;
        if (this.depth > LIMITS.maxDepth) invalid("Expression nesting is too deep");
        const result = this.parseAdditive();
        this.consume("RPAREN");
        this.depth -= 1;
        return { poly: result.poly, ast: { type: "group", argument: result.ast, poly: result.poly } };
      }
      if (token.type === "SQRT") {
        this.index += 1;
        const argument = this.current().type === "LPAREN"
          ? this.parsePrimary()
          : this.parsePower();
        const constant = polynomialConstant(argument.poly);
        const rationalValue = constant === null ? null : coefficientRationalValue(constant);
        if (rationalValue === null) unsupported("Only square roots of rational constants are supported");
        const rootValue = sqrtRational(rationalValue);
        const poly = constantPolynomial(rootValue);
        return { poly, ast: { type: "sqrt", argument: argument.ast, poly } };
      }
      if (token.type === "PLUS_MINUS") unsupported("± is supported only by the solution-set parser");
      invalid(`Unexpected token: ${token.value || token.type}`);
    }
  }

  function parseInternal(source) {
    return new Parser(source).parse();
  }

  function errorResult(error) {
    if (error instanceof AlgebraError) {
      return {
        status: error.code,
        supported: false,
        message: error.message,
      };
    }
    return {
      status: STATUSES.REVIEW_REQUIRED,
      supported: false,
      message: "The expression requires manual review",
    };
  }

  function parseExpression(source) {
    try {
      const parsed = parseInternal(source);
      return {
        status: "PARSED",
        supported: true,
        canonical: polynomialCanonical(parsed.poly),
        variables: [...new Set([...parsed.poly.keys()].flatMap((key) => Object.keys(monomialFromKey(key))))].sort(),
      };
    } catch (error) {
      return errorResult(error);
    }
  }

  function normalizeRadicalExpression(source) {
    try {
      const parsed = parseInternal(source);
      const constant = polynomialConstant(parsed.poly);
      if (constant === null) unsupported("A constant radical expression is required");
      return {
        status: "NORMALIZED",
        supported: true,
        canonical: coefficientCanonical(constant),
        approximateValue: coefficientApproximation(constant),
      };
    } catch (error) {
      return errorResult(error);
    }
  }

  function normalizeDomainContract(contract) {
    if (contract === undefined || contract === null) return null;
    const input = typeof contract === "string" ? { kind: contract } : contract;
    if (!input || typeof input !== "object" || Array.isArray(input)) invalid("Invalid domain contract");
    const kind = String(input.kind || "REAL").toUpperCase();
    const supportedKinds = ["REAL", "INTEGER", "NATURAL", "POSITIVE", "NON_NEGATIVE"];
    if (!supportedKinds.includes(kind)) unsupported(`Unsupported domain kind: ${kind}`);
    const normalizeBoundary = (value) => {
      if (value === undefined || value === null) return null;
      const parsed = parseInternal(value);
      const constant = polynomialConstant(parsed.poly);
      if (constant === null) invalid("Domain boundary must be constant");
      return coefficientCanonical(constant);
    };
    return Object.freeze({
      kind,
      min: normalizeBoundary(input.min),
      max: normalizeBoundary(input.max),
      minInclusive: input.minInclusive !== false,
      maxInclusive: input.maxInclusive !== false,
      allowZero: input.allowZero === true,
      excludedValues: Object.freeze((input.excludedValues || []).map(normalizeBoundary).sort()),
    });
  }

  function domainFingerprint(contract) {
    if (!contract) return "";
    return JSON.stringify(contract);
  }

  function compareExpressions(left, right, options = {}) {
    try {
      const leftDomain = normalizeDomainContract(options.leftDomain || options.domain);
      const rightDomain = normalizeDomainContract(options.rightDomain || options.domain);
      if (domainFingerprint(leftDomain) !== domainFingerprint(rightDomain)) {
        return {
          status: STATUSES.DOMAIN_MISMATCH,
          equivalent: false,
          supported: true,
          leftDomain,
          rightDomain,
        };
      }
      const leftParsed = parseInternal(left);
      const rightParsed = parseInternal(right);
      const equivalent = equalPolynomial(leftParsed.poly, rightParsed.poly);
      return {
        status: equivalent ? STATUSES.EQUIVALENT : STATUSES.NOT_EQUIVALENT,
        equivalent,
        supported: true,
        exact: true,
        leftCanonical: polynomialCanonical(leftParsed.poly),
        rightCanonical: polynomialCanonical(rightParsed.poly),
        domain: leftDomain,
      };
    } catch (error) {
      return { ...errorResult(error), equivalent: null };
    }
  }

  function unwrapGroup(node) {
    let current = node;
    while (current?.type === "group" || (current?.type === "unary" && current.operator === "-")) {
      current = current.type === "group" ? current.argument : current.argument;
    }
    return current;
  }

  function flattenFactorNodes(node, output = []) {
    const current = unwrapGroup(node);
    if (current?.type === "binary" && current.operator === "*") {
      flattenFactorNodes(current.left, output);
      flattenFactorNodes(current.right, output);
      return output;
    }
    if (current?.type === "power" && Number.isInteger(current.exponent) && current.exponent > 1) {
      for (let index = 0; index < current.exponent; index += 1) output.push(unwrapGroup(current.base));
      return output;
    }
    output.push(current);
    return output;
  }

  function polynomialVariables(value) {
    return [...new Set([...value.keys()].flatMap((key) => Object.keys(monomialFromKey(key))))].sort();
  }

  function univariateCoefficients(value, variable) {
    const coefficients = new Map();
    for (const [key, item] of value.entries()) {
      const monomial = monomialFromKey(key);
      const variables = Object.keys(monomial);
      if (variables.some((name) => name !== variable)) return null;
      const exponent = monomial[variable] || 0;
      coefficients.set(exponent, item);
    }
    return coefficients;
  }

  function rationalPolynomialCoefficients(value, variable) {
    const coefficients = univariateCoefficients(value, variable);
    if (!coefficients) return null;
    const result = new Map();
    for (const [exponent, item] of coefficients.entries()) {
      const scalar = coefficientRationalValue(item);
      if (scalar === null) return null;
      result.set(exponent, scalar);
    }
    return result;
  }

  function rationalContent(values) {
    const nonzero = values.filter((value) => !isZeroRational(value));
    if (!nonzero.length) return rational(0n);
    const denominator = nonzero.reduce((result, value) => lcmBigInt(result, value.d), 1n);
    const integers = nonzero.map((value) => absBigInt(value.n * (denominator / value.d)));
    const numerator = integers.reduce((result, value) => gcdBigInt(result, value));
    return rational(numerator, denominator);
  }

  function squareRational(value) {
    if (value.n < 0n) return false;
    return isPerfectSquare(value.n) && isPerfectSquare(value.d);
  }

  function inspectFactorPolynomial(value) {
    if (polynomialIsConstant(value)) return { decidable: true, irreducible: true, constant: true };
    const variables = polynomialVariables(value);
    if (variables.length !== 1) {
      return { decidable: false, reason: "MULTIVARIATE_FACTOR_REQUIRES_REVIEW" };
    }
    const coefficients = rationalPolynomialCoefficients(value, variables[0]);
    if (!coefficients) return { decidable: false, reason: "RADICAL_COEFFICIENT_FACTOR_REQUIRES_REVIEW" };
    const degree = Math.max(...coefficients.keys());
    const content = rationalContent([...coefficients.values()]);
    const primitive = equalRational(content, rational(1n));
    if (degree <= 1) {
      return {
        decidable: true,
        irreducible: primitive,
        constant: false,
        reason: primitive ? null : "COMMON_NUMERIC_FACTOR_REMAINS",
      };
    }
    if (degree === 2) {
      const a = coefficients.get(2) || rational(0n);
      const b = coefficients.get(1) || rational(0n);
      const c = coefficients.get(0) || rational(0n);
      const discriminant = subtractRational(
        multiplyRational(b, b),
        multiplyRational(rational(4n), multiplyRational(a, c))
      );
      const reducible = discriminant.n >= 0n && squareRational(discriminant);
      return {
        decidable: true,
        irreducible: primitive && !reducible,
        constant: false,
        reason: !primitive
          ? "COMMON_NUMERIC_FACTOR_REMAINS"
          : reducible
            ? "REDUCIBLE_QUADRATIC_FACTOR_REMAINS"
            : null,
      };
    }
    return { decidable: false, reason: "DEGREE_ABOVE_TWO_REQUIRES_REVIEW" };
  }

  function assessFactorization(candidate, original, options = {}) {
    try {
      const candidateParsed = parseInternal(candidate);
      const originalParsed = parseInternal(original);
      const equivalent = equalPolynomial(candidateParsed.poly, originalParsed.poly);
      if (!equivalent) {
        return {
          status: STATUSES.NOT_EQUIVALENT,
          equivalent: false,
          fullyFactored: false,
          supported: true,
        };
      }
      const factors = flattenFactorNodes(candidateParsed.ast);
      const inspections = factors.map((factor) => inspectFactorPolynomial(factor.poly));
      if (inspections.some((inspection) => !inspection.decidable)) {
        return {
          status: STATUSES.REVIEW_REQUIRED,
          equivalent: true,
          fullyFactored: null,
          supported: true,
          reasons: inspections.filter((item) => !item.decidable).map((item) => item.reason),
        };
      }
      const incomplete = inspections.filter((inspection) => !inspection.irreducible);
      const fullyFactored = incomplete.length === 0;
      return {
        status: fullyFactored ? STATUSES.FULLY_FACTORED : STATUSES.EQUIVALENT_NOT_FULLY_FACTORED,
        equivalent: true,
        fullyFactored,
        supported: true,
        factorCount: factors.length,
        reasons: incomplete.map((item) => item.reason),
        domain: String(options.factorDomain || "RATIONAL").toUpperCase(),
      };
    } catch (error) {
      return { ...errorResult(error), equivalent: null, fullyFactored: null };
    }
  }

  function splitTopLevel(value) {
    const entries = [];
    let current = "";
    let depth = 0;
    for (const character of value) {
      if (character === "(") depth += 1;
      if (character === ")") depth -= 1;
      if ((character === "," || character === ";") && depth === 0) {
        if (current.trim()) entries.push(current.trim());
        current = "";
      } else {
        current += character;
      }
    }
    if (depth !== 0) invalid("Unbalanced parentheses");
    if (current.trim()) entries.push(current.trim());
    return entries;
  }

  function solutionText(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .replace(/[−–—]/g, "-")
      .trim();
  }

  function isEmptySolutionText(value) {
    const normalized = solutionText(value).replace(/\s+/g, "").toLowerCase();
    return ["{}", "∅", "해없음", "실근없음", "해가없다", "nosolution", "emptyset"].includes(normalized);
  }

  function stripSetWrapper(value) {
    let text = solutionText(value)
      .replace(/^해(?:는|:)?\s*/i, "")
      .replace(/^solution(?:s)?\s*[:=]?\s*/i, "")
      .trim();
    if ((text.startsWith("{") && text.endsWith("}")) || (text.startsWith("[") && text.endsWith("]"))) {
      text = text.slice(1, -1).trim();
    }
    return text;
  }

  function expandPlusMinus(value) {
    const occurrences = (value.match(/±/g) || []).length;
    if (!occurrences) return [value];
    if (occurrences > 1) unsupported("Multiple ± operators require manual review");
    return [value.replace("±", "+"), value.replace("±", "-")];
  }

  function normalizeSolutionSet(value, options = {}) {
    try {
      if (isEmptySolutionText(value)) {
        return {
          status: "NORMALIZED",
          supported: true,
          roots: [],
          canonicalRoots: [],
          duplicates: [],
          excluded: [],
        };
      }
      const text = stripSetWrapper(value)
        .replace(/\s+또는\s+/g, ";")
        .replace(/\s+or\s+/gi, ";");
      const rawEntries = splitTopLevel(text).flatMap(expandPlusMinus);
      if (!rawEntries.length) invalid("Solution set is empty");
      const parsedEntries = rawEntries.map((entry) => {
        const cleaned = entry.replace(/^[A-Za-z]\s*=\s*/, "").trim();
        const parsed = parseInternal(cleaned);
        const constant = polynomialConstant(parsed.poly);
        if (constant === null) unsupported("Solution values must be constants");
        return {
          source: entry,
          value: constant,
          canonical: coefficientCanonical(constant),
        };
      });
      const domain = normalizeDomainContract(options.domain);
      const allowed = [];
      const excluded = [];
      parsedEntries.forEach((entry) => {
        const result = validateCoefficientDomain(entry.value, domain, options);
        if (result.status === STATUSES.REVIEW_REQUIRED) {
          reviewRequired("A solution value is too close to a domain boundary");
        }
        if (result.status === STATUSES.ALLOWED) allowed.push(entry);
        else excluded.push({ ...entry, reason: result.reason });
      });
      const rootsByCanonical = new Map();
      const duplicates = [];
      allowed.forEach((entry) => {
        if (rootsByCanonical.has(entry.canonical)) duplicates.push(entry.canonical);
        else rootsByCanonical.set(entry.canonical, entry);
      });
      return {
        status: "NORMALIZED",
        supported: true,
        roots: [...rootsByCanonical.values()].map((entry) => entry.source),
        canonicalRoots: [...rootsByCanonical.keys()].sort(),
        duplicates: [...new Set(duplicates)].sort(),
        excluded: excluded.map((entry) => ({ value: entry.source, canonical: entry.canonical, reason: entry.reason })),
        domain,
      };
    } catch (error) {
      return errorResult(error);
    }
  }

  function canonicalToCoefficient(canonical) {
    const parsed = parseInternal(canonical.replace(/sqrt/g, "sqrt"));
    return polynomialConstant(parsed.poly);
  }

  function validateCoefficientDomain(value, domain, options = {}) {
    if (!domain) return { status: STATUSES.ALLOWED, allowed: true };
    const tolerance = Number(options.numericTolerance ?? DEFAULT_NUMERIC_TOLERANCE);
    const rationalValue = coefficientRationalValue(value);
    const approximate = coefficientApproximation(value);
    let allowed = true;
    let reason = null;
    if (domain.kind === "INTEGER" || domain.kind === "NATURAL") {
      const integer = rationalValue !== null && rationalValue.d === 1n;
      if (!integer) {
        allowed = false;
        reason = "NOT_INTEGER";
      }
      if (allowed && domain.kind === "NATURAL") {
        const minimum = domain.allowZero ? 0n : 1n;
        if (rationalValue.n < minimum) {
          allowed = false;
          reason = "NOT_NATURAL";
        }
      }
    } else if (domain.kind === "POSITIVE") {
      if (coefficientIsZero(value) || approximate < -tolerance) {
        allowed = false;
        reason = "NOT_POSITIVE";
      } else if (Math.abs(approximate) <= tolerance) {
        return {
          status: STATUSES.REVIEW_REQUIRED,
          allowed: null,
          reason: "VALUE_NEAR_ZERO_BOUNDARY",
          approximateValue: approximate,
          tolerance,
        };
      }
    } else if (domain.kind === "NON_NEGATIVE") {
      if (approximate < -tolerance) {
        allowed = false;
        reason = "NEGATIVE";
      } else if (!coefficientIsZero(value) && Math.abs(approximate) <= tolerance) {
        return {
          status: STATUSES.REVIEW_REQUIRED,
          allowed: null,
          reason: "VALUE_NEAR_ZERO_BOUNDARY",
          approximateValue: approximate,
          tolerance,
        };
      }
    }

    const compareBoundary = (canonical, side, inclusive) => {
      if (!canonical || !allowed) return;
      const boundary = canonicalToCoefficient(canonical);
      const difference = approximate - coefficientApproximation(boundary);
      if (Math.abs(difference) <= tolerance && !inclusive) {
        allowed = false;
        reason = `${side}_BOUNDARY_EXCLUDED`;
      } else if (side === "MIN" && difference < -tolerance) {
        allowed = false;
        reason = "BELOW_MINIMUM";
      } else if (side === "MAX" && difference > tolerance) {
        allowed = false;
        reason = "ABOVE_MAXIMUM";
      }
    };
    compareBoundary(domain.min, "MIN", domain.minInclusive);
    compareBoundary(domain.max, "MAX", domain.maxInclusive);
    if (allowed && domain.excludedValues.includes(coefficientCanonical(value))) {
      allowed = false;
      reason = "EXPLICITLY_EXCLUDED";
    }
    return {
      status: allowed ? STATUSES.ALLOWED : STATUSES.EXCLUDED,
      allowed,
      reason,
      approximateValue: approximate,
      tolerance,
    };
  }

  function validateDomain(value, contract, options = {}) {
    try {
      const parsed = parseInternal(value);
      const constant = polynomialConstant(parsed.poly);
      if (constant === null) unsupported("Domain values must be constants");
      const domain = normalizeDomainContract(contract);
      return {
        ...validateCoefficientDomain(constant, domain, options),
        domain,
        canonical: coefficientCanonical(constant),
      };
    } catch (error) {
      return errorResult(error);
    }
  }

  function compareSolutionSets(expected, actual, options = {}) {
    const expectedSet = normalizeSolutionSet(expected, options);
    if (!expectedSet.supported) return { ...expectedSet, correct: null };
    const actualSet = normalizeSolutionSet(actual, options);
    if (!actualSet.supported) return { ...actualSet, correct: null };
    if (actualSet.excluded.length && options.allowExcludedActual !== true) {
      return {
        status: STATUSES.INCORRECT,
        correct: false,
        supported: true,
        reason: "OUT_OF_DOMAIN_ROOT_INCLUDED",
        expected: expectedSet,
        actual: actualSet,
      };
    }
    if (options.rejectDuplicates && actualSet.duplicates.length) {
      return {
        status: STATUSES.INCORRECT,
        correct: false,
        supported: true,
        reason: "DUPLICATE_ROOTS",
        expected: expectedSet,
        actual: actualSet,
      };
    }
    const correct = expectedSet.canonicalRoots.length === actualSet.canonicalRoots.length
      && expectedSet.canonicalRoots.every((rootValue, index) => rootValue === actualSet.canonicalRoots[index]);
    return {
      status: correct ? STATUSES.CORRECT : STATUSES.INCORRECT,
      correct,
      supported: true,
      expected: expectedSet,
      actual: actualSet,
    };
  }

  function splitEquation(value) {
    const source = normalizeSource(value);
    const positions = [];
    let depth = 0;
    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      if (character === "(") depth += 1;
      if (character === ")") depth -= 1;
      if (character === "=" && depth === 0) positions.push(index);
    }
    if (positions.length !== 1) invalid("Exactly one equation sign is required");
    return [source.slice(0, positions[0]), source.slice(positions[0] + 1)];
  }

  function normalizedEquationPolynomial(value) {
    const [left, right] = splitEquation(value);
    return subtractPolynomial(parseInternal(left).poly, parseInternal(right).poly);
  }

  function proportionalPolynomials(left, right) {
    if (left.size === 0 || right.size === 0) return left.size === right.size;
    const leftKeys = [...left.keys()].sort();
    const rightKeys = [...right.keys()].sort();
    if (leftKeys.length !== rightKeys.length || leftKeys.some((key, index) => key !== rightKeys[index])) return false;
    const firstKey = leftKeys[0];
    let ratio;
    try {
      ratio = multiplyCoefficient(right.get(firstKey), inverseCoefficient(left.get(firstKey)));
    } catch (_) {
      return null;
    }
    if (coefficientIsZero(ratio)) return false;
    return leftKeys.every((key) => equalCoefficient(
      multiplyCoefficient(left.get(key), ratio),
      right.get(key)
    ));
  }

  function compareEquationSteps(previous, next, options = {}) {
    try {
      const domain = normalizeDomainContract(options.domain);
      const previousPolynomial = normalizedEquationPolynomial(previous);
      const nextPolynomial = normalizedEquationPolynomial(next);
      const proportional = proportionalPolynomials(previousPolynomial, nextPolynomial);
      if (proportional === null) {
        return {
          status: STATUSES.REVIEW_REQUIRED,
          equivalent: null,
          supported: true,
          reason: "EQUATION_SCALE_REQUIRES_REVIEW",
          domain,
        };
      }
      return {
        status: proportional ? STATUSES.VALID_STEP : STATUSES.INVALID_STEP,
        equivalent: proportional,
        supported: true,
        exact: true,
        previousCanonical: polynomialCanonical(previousPolynomial),
        nextCanonical: polynomialCanonical(nextPolynomial),
        domain,
      };
    } catch (error) {
      return { ...errorResult(error), equivalent: null };
    }
  }

  function validateProcessSteps(steps, options = {}) {
    if (!Array.isArray(steps) || steps.length < 2) {
      return {
        status: STATUSES.INVALID_INPUT,
        supported: false,
        message: "At least two process steps are required",
      };
    }
    const transitions = [];
    for (let index = 1; index < steps.length; index += 1) {
      transitions.push({
        fromIndex: index - 1,
        toIndex: index,
        ...compareEquationSteps(steps[index - 1], steps[index], options),
      });
    }
    if (transitions.some((item) => item.status === STATUSES.UNSUPPORTED_EXPRESSION || item.status === STATUSES.INVALID_INPUT)) {
      return { status: STATUSES.UNSUPPORTED_EXPRESSION, supported: false, transitions };
    }
    if (transitions.some((item) => item.status === STATUSES.REVIEW_REQUIRED)) {
      return { status: STATUSES.REVIEW_REQUIRED, supported: true, transitions };
    }
    const valid = transitions.every((item) => item.status === STATUSES.VALID_STEP);
    return {
      status: valid ? STATUSES.VALID_STEP : STATUSES.INVALID_STEP,
      valid,
      supported: true,
      transitions,
    };
  }

  return Object.freeze({
    VERSION,
    DEFAULT_NUMERIC_TOLERANCE,
    LIMITS,
    STATUSES,
    parseExpression,
    normalizeRadicalExpression,
    compareExpressions,
    assessFactorization,
    normalizeSolutionSet,
    compareSolutionSets,
    normalizeDomainContract,
    validateDomain,
    compareEquationSteps,
    validateProcessSteps,
  });
});
