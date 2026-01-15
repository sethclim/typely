import { chromium } from "@playwright/test";
import fs from "fs/promises";

(async () => {
    const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");

    const context = browser.contexts()[0];
    const page = context.pages()[0]; // <-- your already open tab

    const raw = await fs.readFile("./tests/fake_resume_data.json", "utf-8");
    const data = JSON.parse(raw);

    await page.goto("http://localhost:5173/onBoarding");

    console.log("Connected to:", page.url());

    await page.waitForSelector('#engineering-card', { state: 'visible' });
    await page.click('#engineering-card');

    await page.waitForSelector('#onboarding-next', { state: 'visible' });
    await page.click('#onboarding-next');

    await page.waitForSelector("#fname-input");
    await page.fill("#fname-input", "John");
    await page.fill("#lname-input", "Doe");
    await page.fill("#email-input", "johndoe@gmail.com");
    await page.fill("#phone-input", "111-111-1111");
    await page.fill("#location-input", "Toronto ON");
    await page.fill("#website-input", "sethclimenhaga.dev");
    await page.fill("#github-input", "github.com/sethclim");

    await page.waitForSelector('#skills-add-btn', { state: 'visible' });
    await page.click('#skills-add-btn');

    await page.fill("#skills-title-0", "Languages");
    await page.fill("#skills-points-0", "C++, Rust, Python, Kotlin, C\\#");

    await page.click('#skills-add-btn');

    await page.fill("#skills-title-1", "Frameworks");
    await page.fill("#skills-points-1", "Skia, Vulkan, ImGUI");

    await page.click('#skills-add-btn');
    
    await page.fill("#skills-title-2", "Databases");
    await page.fill("#skills-points-2", "Postgres, MySQL");

    await page.click('#skills-add-btn');
    
    await page.fill("#skills-title-3", "General");
    await page.fill("#skills-points-3", "Git, ");

    
    for (let i = 0; i < data.experience.length; i++) {
        const exp = data.experience[i];
        await page.click('#job-add-btn');
        await page.fill(`#exp-company-input-${i}`, exp["company"]);
        await page.fill(`#exp-title-input-${i}`,  exp["title"]);
        await page.fill(`#exp-start-date-input-${i}`, exp["start-date"]);
        await page.fill(`#exp-end-date-input-${i}`, exp["end-date"]);
        await page.fill(`#exp-location-input-${i}`,  exp["location"]);
        await page.fill(`#exp-point-one-input-${i}`, exp["point1"]);
        await page.fill(`#exp-point-two-input-${i}`,  exp["point2"]);
        await page.fill(`#exp-point-three-input-${i}`, exp["point3"]);
        await page.fill(`#exp-point-four-input-${i}`,  exp["point4"]);

    }

    for (let i = 0; i < data.projects.length; i++) {
        const project = data.projects[i];
        await page.click('#project-add-btn');

        await page.fill(`#proj-title-input-${i}`, project.title);
        await page.fill(`#proj-point-one-input-${i}`, project.point1);
        await page.fill(`#proj-point-two-input-${i}`, project.point2);
        await page.fill(`#proj-point-three-input-${i}`, project.point3);
        await page.fill(`#proj-point-four-input-${i}`, project.point4);
    }

    for (let i = 0; i < data.education.length; i++) {
        const edu = data.education[i];
        await page.click('#edu-add-btn');

        await page.fill(`#edu-school-input-${i}`, edu.school);
        await page.fill(`#edu-program-input-${i}`, edu.program);
        await page.fill(`#edu-start-date-input-${i}`, edu["start-date"]);
        await page.fill(`#edu-end-date-input-${i}`, edu["end-date"]);
    }

    console.log("Form filled. Script stopping.");

    //Don't close browser — keep your session alive
})();
