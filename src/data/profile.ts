export const profile = {
  name: 'Ian McCallum',
  title: 'Founder & AI Engineer',
  location: 'Naperville, Illinois',
  schoolLocation: 'Champaign, Illinois',
  age: 18,
  summary: 'A builder working across practical AI systems, business execution, shipped client websites, and creative work.',
  shortBio: 'Ian McCallum is the founder of Beat the Clock and the engineer behind Clockwork, software for home-service teams. From Naperville, Illinois, he studies Finance and Data Science at the University of Illinois Urbana-Champaign’s Gies College of Business. His work spans AI systems, client websites, and creative projects.',
  about: [
    'I’m based between Naperville and Champaign, Illinois. I like working across the technical and business sides of a project: understanding what someone needs, building the software, and making it useful in practice.',
    'Most of my time goes to Clockwork, which I build through Beat the Clock. The current application helps home-service teams with lead intake, follow-ups, and quote and invoice workflows. It combines human-reviewed drafts with configured automatic messages; a deeper residential service workflow is still in development.',
    'My work also spans custom websites for real clients, award-winning entrepreneurship through Virtual Enterprise International, and creative projects in photography, video, YouTube, and Twitch.',
  ],
  education: [
    {
      school: 'University of Illinois Urbana-Champaign',
      location: 'Champaign, IL',
      date: 'Expected Class of 2030',
      detail: 'Gies College of Business · Finance & Data Science',
    },
    {
      school: 'Metea Valley High School',
      location: 'Aurora, IL',
      date: 'Class of 2026',
      detail: '4.25 GPA · Illinois State Scholar · Magna Cum Laude · National Honor Society',
    },
  ],
  skills: ['AI systems design', 'Prompt engineering', 'LLM integration', 'Python', 'JavaScript', 'React', 'Product design', 'Client communication', 'Premiere Pro', 'After Effects', 'Photoshop'],
} as const;

// Ian's About, in his voice, for the "Read my full story" section. Work and
// dates must match src/data/resume.ts.
export const story = {
  intro: 'Hello! I’m 18 years old, and I’m excited to share a little bit about who I am, what I do, and what I love. I graduated from Metea Valley High School with a 4.25 GPA, was named an Illinois State Scholar, and graduated magna cum laude. Now I’m at the University of Illinois Urbana-Champaign, majoring in Finance and Data Science through the Gies College of Business. I grew up in the suburbs of Chicago, but I was born in the city and spent the first five years of my life there. At home, I’m surrounded by my three energetic younger sisters, my supportive parents, and our adorable dog Zoey. Together we’ve created countless memories, some chaotic and some peaceful, that have shaped the person I’ve become.',
  chapters: [
    {
      heading: 'Early influences',
      paragraphs: ['Growing up, I had the privilege of visiting my grandparents’ home in the Northwoods of Wisconsin. Picture peaceful lakes, towering pines, and jaw-dropping autumn colors that look like they’ve been painted by Mother Nature herself. Spending time up there taught me to appreciate the serenity of the outdoors, fueling my curiosity and love for the natural world. Even now, whenever I find a chance to escape the hustle of suburban life, I’m drawn to exploring lakes, forests, and other hidden pockets of nature.'],
    },
    {
      heading: 'Personal growth',
      paragraphs: ['I’ve always been someone who thinks big and dreams bigger. One of my main goals is to build my own business and achieve financial freedom one day. I’d say my strongest trait is my work ethic. When something captures my attention, I pour myself into it until I see results. I was diagnosed with ADHD, which I initially struggled to accept, but I’ve learned to see it as my superpower. It can be challenging at times, but it also lets me become hyperfocused on subjects I’m passionate about and turn those passions into real accomplishments.'],
    },
    {
      heading: 'Technical journey',
      paragraphs: [
        'I’ve been coding since I was ten, starting with HTML, CSS, and JavaScript and building whatever I could get to load in a browser. In high school, Web Design pulled me back in, and two classes I didn’t expect to matter ended up mattering a lot: AP European History taught me how to absorb a mountain of information, and AP Psychology taught me why people make the choices they do. Both show up every time I design software for real people. During the pandemic, when I was 12, I started exploring cryptocurrency, my first real look at technology that could change how things work instead of just how they look.',
        'Then I started building with AI, and websites stopped feeling like the finish line. I taught myself Python, prompt engineering, and how to connect large language models to real software. Designing Clockwork pushed me into harder problems: how an AI assistant should draft messages for a person to approve before anything sends, why prices should come from a company’s own rate card instead of a model’s guess, and how to write tests that fail the build when the AI breaks its own rules. That’s the work I want to spend my life on: technology that feels like it came from the future, built carefully enough to trust when real customers and real money are on the line.',
      ],

    },
    {
      heading: 'Work experience',
      paragraphs: [
        'My first job was refereeing kids’ soccer games, indoor and outdoor, starting when I was 11. I learned fast that no matter what call you make, someone won’t be happy, and having parents yell at you from the stands builds confidence quicker than anything. I was the one in control of the game, and if someone was upset, that was okay. I reffed until 2024, and I still think about that every time I have to make a call someone won’t like.',
        'Since 2024, I’ve worked part-time in the food department at Target, hauling groceries, stocking shelves, and helping customers on busy shifts. It taught me to keep a good attitude when the work is physical and the store is packed. In the summer of 2025, I also worked as a runner for Dan Firks’ team at Coldwell Banker, which gave me a close look at how a real estate business runs day to day.',
        'Websites are where I got my start. Since 2023, I’ve built custom sites for paying clients, including Imanol VillaGomez, a concert videographer who has shot for Charli XCX and Playboi Carti; Fortivus Academy, the largest rugby program in Naperville; TMM Photography; and Nics Marketing. In high school, I also led development of Luminate’s website for Virtual Enterprises International, which took first place nationally. Running every project myself, from the first conversation to launch day, taught me how to turn what someone describes into something they can actually use. But websites were never the end goal. What I really want to build is next-generation AI and the kind of technology that still feels like science fiction. Those client projects were my training ground for Beat the Clock, where I’m now building that kind of technology into a product of my own.',
      ],
    },
    {
      heading: 'Community involvement',
      paragraphs: ['In addition to my part-time jobs, I stayed active in school clubs throughout high school. I served as a UNICEF board member for two years, helping create fun activities that raise awareness and fundraise for children in need. During my senior year, I joined Eco Club to learn more about sustainability and environmental action, and I picked up Ultimate Frisbee as a fun way to stay active outside of soccer. I’m thankful to have been part of groups that make a positive difference in the world and let me grow as a person at the same time.'],
    },
    {
      heading: 'Building Beat the Clock',
      paragraphs: ['Building my own business used to be a line on a goals list. Now it’s most of my week. I started Beat the Clock in December 2024, automating other people’s businesses with off-the-shelf tools, and kept hitting the same wall: those tools could move data between apps, but they couldn’t do the work. So in late 2025, I started building Clockwork, software that helps residential service companies, starting with HVAC, keep customer work organized. It’s still in development, and I’m looking for HVAC teams willing to sit through a demo and tell me where it’s wrong. The hardest lessons so far haven’t been technical: listening more than I pitch, cutting features I liked, and keeping momentum when a week of work is invisible from the outside.'],
    },
  ],
  hobbiesIntro: 'Below, I’ve detailed some of my favorite hobbies and interests. I hope you enjoy getting to know me a bit better!',
  hobbies: [
    { name: 'Concerts & music', text: 'I’ve seen more than 75 artists live, from hip-hop to electronic and most genres in between. Two shows sit at the top of the list: Kanye West at Soldier Field, and Rüfüs Du Sol at Lollapalooza, with Chicago’s skyline behind the stage. A great live set changes how I hear an album afterward. When I’m not at a show, I’m listening while I code or lift, and usually figuring out who to see next.' },
    { name: 'Movies', text: 'My favorite movie is After Hours, Martin Scorsese’s 1985 dark comedy about a guy who heads to SoHo for a date and spends the rest of the night trying, and failing, to get home. It’s funny, tense, and paranoid all at once, and it never tells you how to feel. Shooting and editing my own videos changed how I watch films: I pay as much attention to the pacing and the cuts as to the plot.' },
    { name: 'Finding beauty in unexpected places', text: 'On the Naperville Riverwalk in the fall, I’ll stop on a stretch I’ve walked dozens of times because the trees along the DuPage River finally turned and the water is holding all that color. The same instinct pulls me toward urban exploration: old buildings and structures that outlived whatever they were built for. Peeling paint and worn brick tell you who was there before you and what they made. I bring my camera to both, and some of my favorite photos come from places nobody would put on a postcard.' },
    { name: 'Photography & videography', text: 'My interest in photography and videography sprouted back in eighth grade, during a Visual Media class that opened my eyes to how powerful and creative these mediums can be. I own a Canon EOS Rebel DSLR, which I use to capture the beauty of everyday life, from the stunning fall colors in Wisconsin to candid moments with my friends. I later added a camcorder to my toolkit, letting me record more dynamic and playful videos of our hangouts and explorations. For me, taking photos and shooting videos is all about storytelling. I love freezing special moments in time and creating something that I can look back on years later with a smile.' },
    { name: 'Soccer', text: 'Soccer has been part of my life for as long as I can remember, thanks to my dad, who’s been crazy about the sport forever. I’ve played on high school and club teams, and there’s nothing quite like the rush of a good match, the smell of the grass, and the bond you form with your teammates. Soccer gives me an outlet to channel my energy and push myself physically, all while having a blast with friends.' },
    { name: 'Weightlifting', text: 'Weightlifting is a newer passion of mine, but one that’s quickly become important. My dad, who’s been lifting since his college days, encouraged me to start. I love feeling my strength grow every time I add more weight or bust out a few extra reps. It’s not just about muscle. It’s also about self-discipline. When life gets overwhelming, hitting the gym helps clear my head and remind me that I’m capable of breaking my own limits.' },
    { name: 'MMA', text: 'MMA has become one of my favorite ways to train. I love the mix of technique, conditioning, and mental toughness it demands. Stepping on the mat pushes me in a completely different way than lifting or soccer, and I always walk away feeling like I learned something about myself.' },
    { name: 'Ping pong', text: 'Ping pong is the one sport where I can lose a point in half a second and win it back on the next serve. It’s quick, it punishes hesitation, and it’s my favorite way to compete with friends without anyone needing cleats.' },
    { name: 'Fishing', text: 'Fishing holds a special place in my heart, largely because it connects me back to my childhood and my family. Growing up, I was lucky to have a pond just a few steps away from my house. My closest friends also enjoyed fishing, so we spent countless afternoons casting lines and sharing laughs. As we got older and gained access to cars, we started exploring nearby lakes, always chasing the next big catch. My grandpa also played a huge role in this hobby. He lives near a beautiful lake in Wisconsin and would take me out on his boat whenever I visited, buying me lures and teaching me different techniques. Every cast brings a mix of anticipation and relaxation, two feelings I treasure.' },
    { name: 'Video editing & YouTube', text: 'During quarantine, I decided to share my passion for gaming by starting a YouTube channel called “Vokel.” While I was at it, I also began streaming on Twitch under the same name. Reaching Twitch Affiliate status and growing my YouTube subscriber count to nearly 500 was incredibly exciting. It showed me that creativity and persistence do pay off. In the process, I developed a strong interest in video editing, learning programs like Adobe After Effects and Premiere Pro. I even had the chance to edit videos for a YouTuber with over 2,000 subscribers. Video editing is like a puzzle: you take all the scattered pieces of footage and shape them into a coherent story. It’s both challenging and deeply rewarding, especially when you see the final product and know you’ve put your unique spin on it.' },
  ],
  closing: 'Thank you for taking the time to learn about me, my journey, and my hobbies. Whether I’m training for MMA, on the soccer field, in the crowd at a concert, behind a camera, or working away on my business, I always do my best to combine passion with hard work. If you’d like to connect, chat, or simply say hello, feel free to reach out. I’m always open to meeting new people, exploring new ideas, and embracing fresh opportunities!',
} as const;
