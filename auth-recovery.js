(function () {
  const AUTH_KEY = "studyCoinAuth";
  const CURRENT_USER_KEY = "studyCoinCurrentUser";

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY)) || {};
    } catch {
      return {};
    }
  };

  const showScreen = (name) => {
    document.querySelectorAll("[data-screen]").forEach((screen) => {
      screen.classList.toggle("active", screen.dataset.screen === name);
    });
  };

  document.querySelectorAll('.auth-switch[data-go="signup"], .auth-switch[data-go="login"]').forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.go));
  });

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-role]").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
    });
  });

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
  });

  const signupButton = document.querySelector("#signupButton");
  signupButton?.addEventListener("click", () => {
    const name = document.querySelector("#studentName")?.value.trim() || "학생";
    const userId = document.querySelector("#signupUser")?.value.trim() || "";
    const password = document.querySelector("#signupPassword")?.value.trim() || "";
    const error = document.querySelector("#signupError");
    const success = document.querySelector("#signupSuccess");
    const role = document.querySelector("[data-role].selected")?.dataset.role || "student";

    error?.classList.add("hidden");
    success?.classList.add("hidden");

    if (!userId || password.length < 4) {
      if (error) error.textContent = "아이디와 4자리 이상의 비밀번호를 입력해 주세요.";
      error?.classList.remove("hidden");
      return;
    }

    const users = getUsers();
    if (users[userId]) {
      if (error) error.textContent = "이미 가입된 아이디예요. 다른 아이디를 입력해 주세요.";
      error?.classList.remove("hidden");
      return;
    }

    users[userId] = {
      id: userId,
      name,
      role,
      password,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, userId);
    success?.classList.remove("hidden");
    setTimeout(() => showScreen("profile-setup"), 250);
  });

  document.querySelector("#loginButton")?.addEventListener("click", () => {
    const userId = document.querySelector("#loginUser")?.value.trim() || "";
    const password = document.querySelector("#loginPassword")?.value.trim() || "";
    const error = document.querySelector("#loginError");
    const user = getUsers()[userId];

    if (!user || user.password !== password) {
      error?.classList.remove("hidden");
      return;
    }

    error?.classList.add("hidden");
    localStorage.setItem(CURRENT_USER_KEY, userId);
    showScreen(user.onboardingComplete ? "home" : "profile-setup");
  });
})();
