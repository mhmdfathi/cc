let dropdownBtns = document.querySelectorAll(".dropdown");
let dropdownMenus = document.querySelectorAll(".dropdown-menu");

document.querySelector(".togle").addEventListener("click", () => {
  document.querySelector(".links ul").classList.toggle("active");
});


// دالة لتفعيل السلوك المناسب حسب حجم الشاشة
function setupDropdownBehavior() {
  // نحذف كل الأحداث القديمة عشان ما تتكررش لما يتغير الحجم
  dropdownBtns.forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });

  dropdownBtns = document.querySelectorAll(".dropdown");
  dropdownMenus = document.querySelectorAll(".dropdown-menu");

  // لو الشاشة كبيرة (أكبر من 1100)
  if (window.innerWidth > 1100) {
    dropdownBtns.forEach((btn, i) => {
      const menu = dropdownMenus[i];

      btn.addEventListener("mouseenter", () => {
        dropdownBtns.forEach((b) => b.classList.remove("hover"));
        dropdownMenus.forEach((m) => m.classList.remove("hover"));

        btn.classList.add("hover");
        menu.classList.add("hover");
      });

      btn.addEventListener("mouseleave", (e) => {
        if (!menu.contains(e.relatedTarget)) {
          btn.classList.remove("hover");
          menu.classList.remove("hover");
        }
      });

      menu.addEventListener("mouseenter", () => {
        btn.classList.add("hover");
        menu.classList.add("hover");
      });

      menu.addEventListener("mouseleave", (e) => {
        if (!btn.contains(e.relatedTarget)) {
          btn.classList.remove("hover");
          menu.classList.remove("hover");
        }
      });
    });
  } else {
    // لو الشاشة صغيرة (أقل من أو تساوي 1100)
    dropdownBtns.forEach((btn, i) => {
      const menu = dropdownMenus[i];

      btn.addEventListener("click", () => {
        const isActive = menu.classList.contains("hover");

        // نقفل كل القوائم الأول
        dropdownMenus.forEach((m) => m.classList.remove("hover"));
        dropdownBtns.forEach((b) => b.classList.remove("hover"));

        // لو مش مفتوحة، نفتحها
        if (!isActive) {
          btn.classList.add("hover");
          menu.classList.add("hover");
        }
      });
    });

    // نقفل القوائم لو المستخدم ضغط خارجها
    document.addEventListener("click", (e) => {
      if (![...dropdownBtns, ...dropdownMenus].some((el) => el.contains(e.target))) {
        dropdownBtns.forEach((b) => b.classList.remove("hover"));
        dropdownMenus.forEach((m) => m.classList.remove("hover"));
      }
    });
  }
}

// تشغيل الدالة أول مرة
setupDropdownBehavior();

// نعيد ضبطها لما المستخدم يغير حجم الشاشة
window.addEventListener("resize", setupDropdownBehavior);





document.querySelectorAll(".log-in-user").forEach((e) => {
  e.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = localStorage.getItem("email");

    if (user || email) {
      // ✅ المستخدم مسجل
      window.location.href = "index-inventory.html"; 
    } else {
      // ❌ المستخدم مش مسجل
      window.location.href = "login.html"; 
    }
  });
});


const loginBtn = document.getElementById("loginBtn"); 
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "index-login.html";
  });
}

const logIn = document.querySelectorAll(".log-in");
const setting = document.getElementById("setting");
const userData = JSON.parse(localStorage.getItem("user"));
if (userData) {
  logIn.forEach((e) => {
    e.classList.add("remove");
  });

  setting.classList.add("active"); 

  if (loginBtn) {
    loginBtn.onclick = () => {
      alert("أنت مسجل بالفعل!");
    };
  }
} else {
  if (loginBtn) {
    loginBtn.onclick = () => {
      window.location.href = "index.html";
      logIn.forEach((e) => {
        e.classList.add("remove");
      });
    };
  }
}

function userDropdown() {
  const userMenu = document.querySelector(".user-content");
  userMenu.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelectorAll(".log-out");

  if (logoutBtn) {
    logoutBtn.forEach((e) => {
      e.addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("email"); 

        window.location.replace("index.html");
      });
    });
  }
});

