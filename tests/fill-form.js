import { chromium } from "@playwright/test";

(async () => {
    const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");

    const context = browser.contexts()[0];
    const page = context.pages()[0]; // <-- your already open tab

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

    
    for(let i = 0; i < 3; i++){
        await page.click('#job-add-btn');
        await page.fill(`#exp-company-input-${i}`, "Meta");
        await page.fill(`#exp-title-input-${i}`, "Software Engineer");
        await page.fill(`#exp-start-date-input-${i}`, "May, 2022");
        await page.fill(`#exp-end-date-input-${i}`, "June, 2024");
        await page.fill(`#exp-point-one-input-${i}`, "I built an ads analytics tool used by 300 ad managers");
        await page.fill(`#exp-point-two-input-${i}`, "I solo developed react");
        await page.fill(`#exp-point-three-input-${i}`, "I build facebook marketplace");
        await page.fill(`#exp-point-four-input-${i}`, "I cancelled the metaverse project +100 aura");
    }

    await page.click('#project-add-btn');

    await page.fill(`#proj-title-input-0`, "Vulkan Ray Tracer");
    await page.fill(`#proj-point-one-input-0`, "managed low level GPU");
    await page.fill(`#proj-point-two-input-0`, "developer raytracing engine");
    await page.fill(`#proj-point-three-input-0`, "developed vector math library");
    await page.fill(`#proj-point-four-input-0`, "optimized for realtime speeds");

    await page.click('#edu-add-btn');

    await page.fill(`#edu-school-input-0`, "University of Washington");
    await page.fill(`#edu-program-input-0`, "Computer Engineering");
    await page.fill(`#edu-start-date-input-0`, "Sept, 2015");
    await page.fill(`#edu-end-date-input-0`, "June, 2019");


    console.log("Form filled. Script stopping.");

    //Don't close browser — keep your session alive
})();
