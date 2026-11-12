
// ==========================================
// CAREERAI - AI CAREER GUIDANCE PORTAL
// ==========================================

// Career database
const careers = [
    {
        name: "Frontend Developer",
        icon: "💻",
        category: "development",
        description: "Build interactive and responsive websites.",
        skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
        roadmap: [
            ["HTML & CSS", "Learn website structure, styling and responsive design."],
            ["JavaScript", "Understand functions, DOM manipulation and APIs."],
            ["React", "Build reusable components and interactive applications."],
            ["Git & GitHub", "Learn version control and publish projects."],
            ["Portfolio Project", "Create and deploy a complete website."]
        ]
    },
    {
        name: "Python Developer",
        icon: "🐍",
        category: "development",
        description: "Develop applications and automation using Python.",
        skills: ["Python", "SQL", "Git"],
        roadmap: [
            ["Python Fundamentals", "Learn variables, loops, functions and OOP."],
            ["Data Structures", "Practice lists, dictionaries and algorithms."],
            ["SQL", "Learn database operations and queries."],
            ["Frameworks", "Explore Flask or Django."],
            ["Projects", "Create and publish Python applications."]
        ]
    },
    {
        name: "Data Scientist",
        icon: "📊",
        category: "data",
        description: "Discover patterns and insights from data.",
        skills: ["Python", "SQL", "Machine Learning", "Data Analysis"],
        roadmap: [
            ["Python", "Learn Python programming and libraries."],
            ["Data Analysis", "Explore Pandas, NumPy and data visualization."],
            ["Statistics", "Understand probability and statistical concepts."],
            ["Machine Learning", "Study regression and classification."],
            ["Projects", "Build a complete data science project."]
        ]
    },
    {
        name: "AI / ML Engineer",
        icon: "🤖",
        category: "ai",
        description: "Build intelligent systems and machine learning models.",
        skills: ["Python", "Machine Learning", "Data Analysis", "SQL"],
        roadmap: [
            ["Python", "Strengthen Python programming."],
            ["Mathematics", "Study statistics and linear algebra."],
            ["Machine Learning", "Learn supervised and unsupervised learning."],
            ["Deep Learning", "Explore neural networks."],
            ["AI Projects", "Build and evaluate intelligent applications."]
        ]
    },
    {
        name: "UI/UX Designer",
        icon: "🎨",
        category: "design",
        description: "Design useful and attractive user experiences.",
        skills: ["Figma", "HTML", "CSS"],
        roadmap: [
            ["Design Fundamentals", "Learn colors, typography and layouts."],
            ["Figma", "Practice wireframes and prototypes."],
            ["UX Research", "Understand user needs and usability."],
            ["Responsive Design", "Design for different screen sizes."],
            ["Portfolio", "Present your design case studies."]
        ]
    },
    {
        name: "Cybersecurity Analyst",
        icon: "🔐",
        category: "security",
        description: "Help protect systems and digital information.",
        skills: ["Cybersecurity", "Python", "SQL", "Git"],
        roadmap: [
            ["Networking", "Learn networking fundamentals."],
            ["Security Basics", "Understand security principles and threats."],
            ["Operating Systems", "Explore system administration basics."],
            ["Security Concepts", "Learn defensive security practices."],
            ["Projects", "Create safe cybersecurity awareness projects."]
        ]
    },
    {
        name: "Full Stack Developer",
        icon: "🌐",
        category: "development",
        description: "Build complete frontend and backend applications.",
        skills: ["HTML", "CSS", "JavaScript", "React", "SQL", "Git"],
        roadmap: [
            ["HTML & CSS", "Build responsive interfaces."],
            ["JavaScript", "Master frontend programming."],
            ["React", "Develop modern user interfaces."],
            ["Databases", "Learn SQL and database design."],
            ["Backend", "Explore Node.js and build APIs."]
        ]
    }
];

let recommendedCareers = [];

// ==========================================
// SELECTED SKILLS
// ==========================================

function getSelectedSkills() {
    return Array.from(
        document.querySelectorAll(
            '#skillsContainer input:checked'
        )
    ).map(input => input.value);
}

// ==========================================
// PROFILE MANAGEMENT
// ==========================================

function saveProfile() {
    const profile = {
        name: document.getElementById("studentName").value.trim(),
        education: document.getElementById("education").value,
        interest: document.getElementById("interest").value,
        experience: document.getElementById("experience").value
    };

    if (!profile.name || !profile.education || !profile.interest) {
        alert("Please complete your name, education and career interest.");
        return;
    }

    localStorage.setItem("careerProfile", JSON.stringify(profile));

    updateDashboard();
    alert("Profile saved successfully!");
}

function loadProfile() {
    const saved = localStorage.getItem("careerProfile");

    if (!saved) return;

    try {
        const profile = JSON.parse(saved);

        document.getElementById("studentName").value = profile.name || "";
        document.getElementById("education").value = profile.education || "";
        document.getElementById("interest").value = profile.interest || "";
        document.getElementById("experience").value = profile.experience || "";
    } catch (error) {
        console.error("Unable to load profile:", error);
    }

    updateDashboard();
}

// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {
    const profile = JSON.parse(
        localStorage.getItem("careerProfile") || "{}"
    );

    const skills = getSelectedSkills();

    document.getElementById("headerName").textContent =
        profile.name || "Student";

    document.getElementById("skillCount").textContent =
        skills.length;

    const completed = [
        profile.name,
        profile.education,
        profile.interest
    ].filter(Boolean).length;

    document.getElementById("profileStatus").textContent =
        Math.round((completed / 3) * 100) + "%";

    document.getElementById("matchCount").textContent =
        recommendedCareers.length;
}

// ==========================================
// CAREER MATCHING ENGINE
// ==========================================

function analyzeSkills() {
    const skills = getSelectedSkills();

    const interest = document.getElementById("interest").value;

    if (skills.length === 0) {
        document.getElementById("analysisMessage").textContent =
            "Please select at least one skill.";
        return;
    }

    recommendedCareers = careers.map(career => {
        const matchedSkills = career.skills.filter(skill =>
            skills.includes(skill)
        );

        const missingSkills = career.skills.filter(skill =>
            !skills.includes(skill)
        );

        const skillScore =
            (matchedSkills.length / career.skills.length) * 100;

        // Career interest bonus
        const interestBonus =
            interest && career.category === interest ? 15 : 0;

        const score = Math.min(
            100,
            Math.round(skillScore * 0.85 + interestBonus)
        );

        return {
            ...career,
            score,
            matchedSkills,
            missingSkills
        };
    });

    recommendedCareers.sort((a, b) => b.score - a.score);

    updateDashboard();
    displayCareers(recommendedCareers);

    document.getElementById("analysisMessage").textContent =
        "Analysis completed! Your career matches are ready.";

    document.getElementById("careers").scrollIntoView({
        behavior: "smooth"
    });
}

// ==========================================
// DISPLAY CAREERS
// ==========================================

function displayCareers(list) {
    const container = document.getElementById("careerResults");

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No matching careers found</h3>
                <p>Try another search term.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = list.map((career, index) => `
        <div class="career-card">

            <div class="career-icon">${career.icon}</div>

            <h3>${career.name}</h3>

            <p>${career.description}</p>

            <div class="match-row">
                <span>Skill Match</span>
                <span>${career.score}%</span>
            </div>

            <div class="progress">
                <div class="progress-fill"
                     style="width:${career.score}%"></div>
            </div>

            <p class="missing-skills">
                <strong>Matched:</strong>
                ${career.matchedSkills.join(", ") || "None yet"}
                <br>
                <strong>To learn:</strong>
                ${career.missingSkills.join(", ") || "No missing skills"}
            </p>

            <button class="primary-btn roadmap-btn"
                    data-career="${career.name}">
                View Roadmap →
            </button>

        </div>
    `).join("");

    // Safe event handling for generated cards
    container.querySelectorAll(".roadmap-btn").forEach(button => {
        button.addEventListener("click", () => {
            showRoadmap(button.dataset.career);
        });
    });
}

// ==========================================
// CAREER SEARCH
// ==========================================

document.getElementById("careerSearch").addEventListener("input", event => {
    const search = event.target.value.toLowerCase();

    const filtered = recommendedCareers.filter(career =>
        career.name.toLowerCase().includes(search)
    );

    displayCareers(filtered);
});

// ==========================================
// ROADMAP
// ==========================================

function showRoadmap(careerName) {
    const career = careers.find(item =>
        item.name === careerName
    );

    if (!career) return;

    const container = document.getElementById("roadmapContent");

    container.innerHTML = `
        <h3 style="margin-bottom:20px">
            ${career.icon} ${career.name} Roadmap
        </h3>

        ${career.roadmap.map((step, index) => `
            <div class="roadmap-item">
                <h3>Step ${index + 1}: ${step[0]}</h3>
                <p>${step[1]}</p>
            </div>
        `).join("")}
    `;

    document.getElementById("roadmap").scrollIntoView({
        behavior: "smooth"
    });
}

// ==========================================
// CAREER INTEREST QUIZ
// ==========================================

document.getElementById("quizBtn").addEventListener("click", () => {
    const selected = document.querySelector(
        'input[name="quiz"]:checked'
    );

    const result = document.getElementById("quizResult");

    if (!selected) {
        result.textContent = "Please select an answer first.";
        return;
    }

    const results = {
        development: "Software Development",
        data: "Data Science",
        ai: "Artificial Intelligence",
        design: "UI/UX Design",
        security: "Cybersecurity"
    };

    const interest = results[selected.value];

    result.textContent =
        "Your suggested interest area is: " + interest + ".";

    localStorage.setItem("careerQuizResult", interest);
});

// ==========================================
// SAVE SELECTED SKILLS
// ==========================================

function saveSkills() {
    localStorage.setItem(
        "careerSkills",
        JSON.stringify(getSelectedSkills())
    );
}

function loadSkills() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("careerSkills") || "[]"
        );

        document.querySelectorAll(
            '#skillsContainer input[type="checkbox"]'
        ).forEach(input => {
            input.checked = saved.includes(input.value);
        });
    } catch (error) {
        console.error("Unable to load skills:", error);
    }
}

// ==========================================
// THEME SWITCHING
// ==========================================

const themeBtn = document.getElementById("themeBtn");

function loadTheme() {
    const theme = localStorage.getItem("careerTheme");

    if (theme === "dark") {
        document.body.classList.add("dark");
        themeBtn.textContent = "☀ Light Mode";
    }
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    localStorage.setItem(
        "careerTheme",
        dark ? "dark" : "light"
    );

    themeBtn.textContent =
        dark ? "☀ Light Mode" : "☾ Change Theme";
});

// ==========================================
// EVENT LISTENERS
// ==========================================

document.getElementById("saveProfile")
    .addEventListener("click", saveProfile);

document.getElementById("analyzeBtn")
    .addEventListener("click", analyzeSkills);

document.querySelectorAll(
    '#skillsContainer input[type="checkbox"]'
).forEach(input => {
    input.addEventListener("change", () => {
        saveSkills();
        updateDashboard();
    });
});

// ==========================================
// INITIALIZE APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadSkills();
    loadTheme();
    updateDashboard();

    // Restore last assessment
    const savedResults = localStorage.getItem("careerAnalysis");

    if (savedResults) {
        try {
            recommendedCareers = JSON.parse(savedResults);
            displayCareers(recommendedCareers);
            updateDashboard();
        } catch (error) {
            console.error("Unable to restore analysis:", error);
        }
    }
});

// Save analysis whenever it changes
document.getElementById("analyzeBtn").addEventListener("click", () => {
    setTimeout(() => {
        localStorage.setItem(
            "careerAnalysis",
            JSON.stringify(recommendedCareers)
        );
    }, 0);
});
