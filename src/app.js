

        /* ============================================
           LOCAL DANCE DATABASE
           - Placeholder: you will populate this from your data.
           - Each track should have:
             - id: unique number (for future playlists)
             - playlist: (name of playlist)
             - level: (beginner, intermediate...)
             - daytaught: (Tuesday, Wednesday,Weekend..)
             - dancename: dance name (vs song name, frequently the same)
             - choreographer
             - song title
             - song artist
             - steps: URL to CopperKnob step sheet (optional)
             - teach: YouTube teach URL (optional)
             - demo: YouTube demo URL (optional)
             - music: YouTube music URL (optional)
           ============================================ */
        const localDanceDatabase = [
            // Example:
            // {
            //   id: 1,
            //   playlist: "Stock-015",
            //   level: "Beginner",
            //   dayTaught: "Tuesday"
            //   name: "Dance With You",
            //   choreographer: "Lisa Johns-Grose",
            //   song: "Dance With You",
            //   artist: "Thomas Rhett",
            //   steps: "https://www.copperknob.co.uk/stepsheets/example",
            //   teach: "https://www.youtube.com/embed/EXAMPLE_TEACH",
            //   demo: "https://www.youtube.com/embed/EXAMPLE_DEMO",
            //   music: "https://www.youtube.com/embed/EXAMPLE_MUSIC"
            // }
            { id: "140", playlist: "Stock-014", level: "High Beginner", daytaught: "Wednesday", name: "Boots Off", choreographer: "Rachael McNaney", song: "Boots Off", artist: "Jon Pardi", steps: "https://www.copperknob.co.uk/stepsheets/5C29H2X/boots-off", teach: "https://youtube.com/embed/YxkCnVnybvk", demo: "https://youtube.com/embed/Xr2MQ8pbPME", music: "https://youtube.com/embed/z8WxUN0hvsA" },
{ id: "139", playlist: "Stock-014", level: "High Beginner", daytaught: "Wednesday", name: "Backup Plan", choreographer: "Melanie Mahoney", song: "Backup Plan", artist: "Zimmerman/Combs", steps: "https://www.copperknob.co.uk/stepsheets/QQ7QP4G/backup-plan", teach: "https://youtube.com/embed/HTciNVT--M4", demo: "https://youtube.com/embed/HTciNVT--M4", music: "https://youtube.com/embed/Yyd5kmngrOU" },
{ id: "138", playlist: "Stock-014", level: "Beginner", daytaught: "Wednesday", name: "Dance With You", choreographer: "Lisa Johns-Grose", song: "Dance With You", artist: "Thomas Rhett", steps: "https://www.copperknob.co.uk/stepsheets/N4GQQ46/dance-with-you", teach: "https://youtube.com/embed/JZtpinRfnVE", demo: "https://youtube.com/embed/JZtpinRfnVE", music: "https://youtube.com/embed/edOFds30j2E" },
{ id: "137", playlist: "Stock-014", level: "High Beginner", daytaught: "Wednesday", name: "Heart of Stone", choreographer: "Pam Horst", song: "Heart of Stone", artist: "Jelly Roll", steps: "https://www.copperknob.co.uk/stepsheets/5JSY4MV/heart-of-stone", teach: "https://youtube.com/embed/2Q3T5NqdvY8", demo: "https://youtube.com/embed/cBl2oFzbiP0", music: "https://youtube.com/embed/U0Gk4Zh93As" },
{ id: "136", playlist: "Stock-014", level: "High Beginner", daytaught: "Wednesday", name: "Blame Texas", choreographer: "Dustin &Sierra", song: "Blame Texas", artist: "Cody Johnson", steps: "https://www.copperknob.co.uk/stepsheets/4KCWB4S/blame-texas", teach: "https://youtube.com/embed/-pZkYtNRI0w", demo: "https://youtube.com/embed/K3osfgAjI7c", music: "https://youtube.com/embed/xiCgNFBB1Mw" },
{ id: "135", playlist: "Stock-014", level: "High Beginner", daytaught: "Wednesday", name: "Wish you Well", choreographer: "Stacey Snyder", song: "Wish You Well", artist: "Vincent Mason", steps: "https://www.copperknob.co.uk/stepsheets/YF5YKG8/wish-you-well", teach: "https://youtube.com/embed/_ehKC5foFyI", demo: "https://youtube.com/embed/_ehKC5foFyI", music: "https://youtube.com/embed/AyUGqKpJviA" },
{ id: "134", playlist: "Stock-014", level: "Beginner", daytaught: "Wednesday", name: "Single Again", choreographer: "Mel Llewelin", song: "Single Again", artist: "Josh Ross", steps: "https://www.copperknob.co.uk/stepsheets/2C5TXZP/single-again", teach: "https://youtube.com/embed/rWsp2q7vyno", demo: "https://youtube.com/embed/rWsp2q7vyno", music: "https://youtube.com/embed/LH3IMXKzKLU" },
{ id: "133", playlist: "Stock-014", level: "Beginner", daytaught: "Wednesday", name: "Something Bout the Summer", choreographer: "Natasha Cormier", song: "Blowin Smoke", artist: "Teddy Swims", steps: "https://www.copperknob.co.uk/stepsheets/9YDQ8ZK/something-bout-the-summer-night", teach: "https://youtube.com/embed/24FnenonL8Y", demo: "https://youtube.com/embed/DWc8tqNvp6U", music: "https://youtube.com/embed/U8-Zv7iNsXI" },
{ id: "132", playlist: "Stock-014", level: "Beginner", daytaught: "Wednesday", name: "A Country Song Came On", choreographer: "Lidia Landon", song: "Country Song Came On", artist: "Luke Bryan", steps: "https://www.copperknob.co.uk/stepsheets/3YZGC22/a-country-song-came-on", teach: "https://youtube.com/embed/LsbN0FFc_JM", demo: "https://youtube.com/embed/LsbN0FFc_JM", music: "https://youtube.com/embed/sgUFpNy9bd4" },
{ id: "131", playlist: "Stock-014", level: "High Beginner", daytaught: "Wednesday", name: "Weren t for the Wind", choreographer: "Amy Christian", song: "Weren t for the Wind", artist: "Ella Langley", steps: "https://www.copperknob.co.uk/stepsheets/KFB5RSS/werent-for-the-wind", teach: "https://youtube.com/embed/kir14LEXM08", demo: "https://youtube.com/embed/6NUYIguWCqc", music: "https://youtube.com/embed/MKivwrA6_bw" },
{ id: "130", playlist: "Stock-013", level: "Intermediate", daytaught: "Wednesday", name: "After Party", choreographer: "Maurice Rowe", song: "After Party", artist: "Koffee Brown", steps: "https://www.copperknob.co.uk/stepsheets/3J25PD4/after-party", teach: "https://youtube.com/embed/-Mcgu9sDY-8", demo: "https://youtube.com/embed/TFhMlHmhIVc", music: "https://youtube.com/embed/kAXwa3C7iP4" },
{ id: "129", playlist: "Stock-013", level: "Improver", daytaught: "Wednesday", name: "Brown Eyed 5 5", choreographer: "Ashley Rose", song: "Brunette", artist: "Tucker Wetmore", steps: "https://www.copperknob.co.uk/stepsheets/DWW362F/brown-eyed-5-5", teach: "https://youtube.com/embed/zb-VcGiwl7Y", demo: "https://youtube.com/embed/zb-VcGiwl7Y", music: "https://youtube.com/embed/_Q6N4C5D9p4" },
{ id: "128", playlist: "Stock-013", level: "Beginner", daytaught: "Wednesday", name: "Like It Like That", choreographer: "Gary Lafferty", song: "Like It Like That", artist: "Dasha", steps: "https://www.copperknob.co.uk/stepsheets/8DSMS4C/like-it-like-that", teach: "https://youtube.com/embed/LjiegxuDEE8", demo: "https://youtube.com/embed/uVTonrpI7QY", music: "https://youtube.com/embed/WOBst92z9n0" },
{ id: "127", playlist: "Stock-013", level: "Absolute Beginner", daytaught: "Wednesday", name: "Alligator Smile", choreographer: "Julie Heinrichs", song: "Can't Keep Up", artist: "Brett Eldredge", steps: "https://www.copperknob.co.uk/stepsheets/NXWN37N/alligator-smile", teach: "https://youtube.com/embed/C5tJTFdU_-k", demo: "https://youtube.com/embed/MzGMxj28aww", music: "https://youtube.com/embed/hZDZnSrJ0P8" },
{ id: "126", playlist: "Stock-013", level: "Beginner", daytaught: "Wednesday", name: "Choosin Texas", choreographer: "Nidhi Risi", song: "Choosin Texas", artist: "Ella Langley", steps: "https://www.copperknob.co.uk/stepsheets/LRV9X25/choosin-texas", teach: "https://youtube.com/embed/851epk3lotY", demo: "https://youtube.com/embed/mEeJFEtGtOA", music: "https://youtube.com/embed/hLOheGDwD_0" },
{ id: "125", playlist: "Stock-013", level: "High Beginner", daytaught: "Wednesday", name: "Do Si Dough", choreographer: "Glover & Szymanski", song: "Do Si Dough", artist: "Josiah Siska", steps: "https://www.copperknob.co.uk/stepsheets/CT3L6XC/do-si-dough", teach: "https://youtube.com/embed/AsCS6c-G1_Q", demo: "https://youtube.com/embed/VRjv5gxBWe0", music: "https://youtube.com/embed/kb3L9kVKOPw" },
{ id: "124", playlist: "Stock-013", level: "Beginner", daytaught: "Wednesday", name: "Country Tightrope", choreographer: "Daren Bailey", song: "Tightrope", artist: "Zach Top", steps: "https://www.copperknob.co.uk/stepsheets/T5KS4TQ/country-tightrope", teach: "https://youtube.com/embed/LfpzB_lSLfs", demo: "https://youtube.com/embed/UPAY5lKzY1k", music: "https://youtube.com/embed/XYYqmbARbkM" },
{ id: "123", playlist: "Stock-013", level: "Beginner", daytaught: "Wednesday", name: "Getaway Car", choreographer: "Brandon &Trevor", song: "Getaway Car", artist: "Dustin Lynch", steps: "https://www.copperknob.co.uk/stepsheets/DSWK5BY/getaway-car", teach: "https://youtube.com/embed/VAnRxJdP1VY", demo: "https://youtube.com/embed/8ah3554i-CA", music: "https://youtube.com/embed/-LcTwwCTN7M" },
{ id: "122", playlist: "Stock-013", level: "High Beginner", daytaught: "Wednesday", name: "Good Times and Tan Lines", choreographer: "Chris Brocklesby", song: "Good Times &Tan Lines", artist: "Zach Top", steps: "https://www.copperknob.co.uk/stepsheets/QYSD83T/good-times-and-tan-lines", teach: "https://youtube.com/embed/ZwQjOPKPGDU", demo: "https://youtube.com/embed/nrQrZySBtVI", music: "https://youtube.com/embed/yWsH5c4ZaLs" },
{ id: "121", playlist: "Stock-013", level: "Beginner", daytaught: "Wednesday", name: "Dolly Would", choreographer: "Willie Brown", song: "Dolly Would", artist: "The Dryes", steps: "https://www.copperknob.co.uk/stepsheets/L2X4P4G/dolly-would", teach: "https://youtube.com/embed/g5fXXe2qzDs", demo: "https://youtube.com/embed/4rakHHC2Fv8", music: "https://youtube.com/embed/ulLLp_5094M" },
{ id: "120", playlist: "Stock-012", level: "High Beginner", daytaught: "Wednesday", name: "Old Ropers", choreographer: "Courtney Rowe", song: "Boots", artist: "Thomas Rhett", steps: "https://www.copperknob.co.uk/stepsheets/QSQM4NR/old-ropers", teach: "https://youtube.com/embed/kypmUTIJ1uI", demo: "https://youtube.com/embed/kypmUTIJ1uI", music: "https://youtube.com/embed/zmG_97gmNmI" },
{ id: "119", playlist: "Stock-012", level: "Absolute Beginner", daytaught: "Wednesday", name: "Twenty Two", choreographer: "Michelle Risley", song: "You Look Like You Love Me", artist: "Ella Langley", steps: "https://www.copperknob.co.uk/stepsheets/C8646RR/twenty-two-22", teach: "https://youtube.com/embed/9zxCLaJECFA", demo: "https://youtube.com/embed/luQb4lPTvMs", music: "https://youtube.com/embed/4VqUNK2izxc" },
{ id: "118", playlist: "Stock-012", level: "Easy Intermediate", daytaught: "Wednesday", name: "Memory Lane-No Teach", choreographer: "Jaelin Fitch", song: "Memory Lane", artist: "Old Dominion", steps: "https://www.copperknob.co.uk/stepsheets/BK58TS4/memory-lane", teach: "https://youtube.com/embed/cf3V7gbfzCY", demo: "https://youtube.com/embed/cf3V7gbfzCY", music: "https://youtube.com/embed/ZfOz5wC8SBE" },
{ id: "117", playlist: "Stock-012", level: "Improver", daytaught: "Wednesday", name: "Happen to Me", choreographer: "Stacey Snyder", song: "Happen to Me", artist: "Russell Dickerson", steps: "https://www.copperknob.co.uk/stepsheets/LBSTQ4Y/happen-to-me", teach: "https://youtube.com/embed/N4RJMs6GhH0", demo: "https://youtube.com/embed/N4RJMs6GhH0", music: "https://youtube.com/embed/396i2z3uqYk" },
{ id: "116", playlist: "Stock-012", level: "Beginner", daytaught: "Wednesday", name: "Baby I Wanna Know", choreographer: "Niels Poulsen", song: "Hey Baby", artist: "Max Jackson", steps: "https://www.copperknob.co.uk/stepsheets/4NLC76N/baby-i-wanna-know", teach: "https://youtube.com/embed/t4ucorsuOlE", demo: "https://youtube.com/embed/t4ucorsuOlE", music: "https://youtube.com/embed/CoXPztbXS2o" },
{ id: "115", playlist: "Stock-012", level: "Improver", daytaught: "Wednesday", name: "Two of Us(no teach/demo)", choreographer: "Connor & Maurice", song: "Two of Us", artist: " Brett Kissel & Cooper Alan", steps: "https://www.copperknob.co.uk/stepsheets/Y4ZXB4F/two-of-us", teach: "https://youtube.com/embed/O3JVZ36RKhs", demo: "https://youtube.com/embed/O3JVZ36RKhs", music: "https://youtube.com/embed/O3JVZ36RKhs" },
{ id: "114", playlist: "Stock-012", level: "Improver", daytaught: "Wednesday", name: "Gin & Tonic Kisses", choreographer: "Kathy Brown", song: "Drunk(AND I don't wanna go home", artist: "Elle King & Miranda Lambert", steps: "https://www.copperknob.co.uk/qr/2N3JXYM", teach: "https://youtube.com/embed/hNWrZsMJgDg", demo: "https://youtube.com/embed/2uSIoo0EuvE", music: "https://youtube.com/embed/CS9zbWLiI0o" },
{ id: "113", playlist: "Stock-012", level: "High Beginner", daytaught: "Wednesday", name: "Where the Wild Things Are", choreographer: "Pam Wingo", song: "Where the Wild Things Are", artist: "Luke Combs", steps: "https://www.copperknob.co.uk/stepsheets/4N9PKV2/where-the-wild-things-are", teach: "https://youtube.com/embed/JvS8pIoFhDk", demo: "https://youtube.com/embed/DK9hWOcJxsg", music: "https://youtube.com/embed/-zLml4bc_Gs" },
{ id: "112", playlist: "Stock-012", level: "High Beginner", daytaught: "Wednesday", name: "2 Pairs & A Good Time", choreographer: "Andrea Warren", song: "2 Pair", artist: "Kane Brown", steps: "https://www.copperknob.co.uk/stepsheets/Z6NTBX7/2-pairs-a-good-time", teach: "https://youtube.com/embed/bbjQtrcDU9c", demo: "https://youtube.com/embed/LSJ4JUq7sgU", music: "https://youtube.com/embed/XpEnvGXwInU" },
{ id: "111", playlist: "Stock-012", level: "High Beginner", daytaught: "Wednesday", name: "Like a Lasso", choreographer: "Chelsea Butler", song: "Lasso", artist: "Jake Banfield", steps: "https://www.copperknob.co.uk/stepsheets/VNBTMM4/like-a-lasso", teach: "https://youtube.com/embed/G77TvS-Wz28", demo: "https://youtube.com/embed/zRj7v5moNzw", music: "https://youtube.com/embed/mobQ2Kq7JiY" },
{ id: "110", playlist: "Stock-011", level: "Easy Improver", daytaught: "Wednesday", name: "Need a Favor", choreographer: "Sue Wellesley", song: "Need a Favor", artist: "Jelly Roll", steps: "https://www.copperknob.co.uk/stepsheets/6LSVVX9/need-a-favor", teach: "https://youtube.com/embed/db8Fe8FeRag", demo: "https://youtube.com/embed/D3339Il13VQ", music: "https://youtube.com/embed/TbXEQOhU2xw" },
{ id: "109", playlist: "Stock-011", level: "Beginner", daytaught: "Wednesday", name: "Not at this Party", choreographer: "Kris Lonnquist", song: "Not at this Party", artist: "Dasha", steps: "https://www.copperknob.co.uk/stepsheets/B7SYRJR/not-at-this-party", teach: "https://youtube.com/embed/lrvxFe_UVWQ", demo: "https://youtube.com/embed/lrvxFe_UVWQ", music: "https://youtube.com/embed/59ct0ij5pr8" },
{ id: "108", playlist: "Stock-011", level: "Improver", daytaught: "Wednesday", name: "Lets Do Da Dance", choreographer: "Rob Fowler", song: "Lets Do Da Dance", artist: "Rexxie Dallas", steps: "https://www.copperknob.co.uk/stepsheets/LHBHF72/lets-do-da-dance", teach: "https://youtube.com/embed/C_tmO14ube8", demo: "https://youtube.com/embed/W1eDiORlZm8", music: "https://youtube.com/embed/oSvfo7mRHYI" },
{ id: "107", playlist: "Stock-011", level: "Absolute Beginner", daytaught: "Wednesday", name: "Rowdy Crowd", choreographer: "Maggie Shipley", song: "Y allsome", artist: "Pryor and Lee", steps: "https://www.copperknob.co.uk/stepsheets/9W5FHV7/rowdy-crowd", teach: "https://youtube.com/embed/8fa8IZR9hyE", demo: "https://youtube.com/embed/HU_PEHqtji4", music: "https://youtube.com/embed/vsocfj0lOIs" },
{ id: "106", playlist: "Stock-011", level: "Absolute Beginner", daytaught: "Wednesday", name: "Hoedown", choreographer: "Gary O Reilly", song: "Hoedown", artist: "Ink", steps: "https://www.copperknob.co.uk/stepsheets/H8Q99YY/hoedown", teach: "https://youtube.com/embed/n1n1jEVLVv4", demo: "https://youtube.com/embed/QbWwxn3AxBY", music: "https://youtube.com/embed/U-n-ZI_OnLo" },
{ id: "105", playlist: "Stock-011", level: "Beginner", daytaught: "Wednesday", name: "Bar Cha Cha", choreographer: "Evan VanScoyk", song: "After All The Bars Have Closed", artist: "Thomas Rhett", steps: "https://www.copperknob.co.uk/stepsheets/QC93H6V/bar-cha-cha", teach: "https://youtube.com/embed/GXqrolRngLQ", demo: "https://youtube.com/embed/tTtfwssRKtk", music: "https://youtube.com/embed/OulCYepVX-U" },
{ id: "104", playlist: "Stock-011", level: "Beginner", daytaught: "Wednesday", name: "The Cowboi Boogie", choreographer: "Big Mucci", song: "Cowboy Boogie", artist: "Meechie", steps: "https://www.copperknob.co.uk/stepsheets/82LB99F/the-cowboi-boogie", teach: "https://youtube.com/embed/NhcRFrhSuj0", demo: "https://youtube.com/embed/S4PU4W5GpLw", music: "https://youtube.com/embed/bFrYS28IV-E" },
{ id: "103", playlist: "Stock-011", level: "Beginner", daytaught: "Wednesday", name: "Bottle Rockets", choreographer: "Susan Doyle", song: "Bottle Rockets", artist: "Scotty McCreary", steps: "https://www.copperknob.co.uk/stepsheets/KS9CT2W/bottle-rockets", teach: "https://youtube.com/embed/ENQVssy6bEo", demo: "https://youtube.com/embed/Kysu8Ojhxqw", music: "https://youtube.com/embed/fHUI2pstSqI" },
{ id: "102", playlist: "Stock-011", level: "High Beginner", daytaught: "Wednesday", name: "Crankin Country", choreographer: "Michelle Wright", song: "Good Time for a Good Time", artist: "Josh Logan", steps: "https://www.copperknob.co.uk/stepsheets/3QRC7NV/crankin-country", teach: "https://youtube.com/embed/nrpolG1JWqU", demo: "https://youtube.com/embed/nrpolG1JWqU", music: "https://youtube.com/embed/vTJqJLRRY68" },
{ id: "101", playlist: "Stock-011", level: "Improver", daytaught: "Wednesday", name: "Hole in my Heart", choreographer: "Laura Miller", song: "Love Somebody", artist: "Morgan Wallen", steps: "https://www.copperknob.co.uk/stepsheets/B92MX6K/hole-in-my-heart", teach: "https://youtube.com/embed/e1ZNIFz8zqM", demo: "https://youtube.com/embed/e1ZNIFz8zqM", music: "https://youtube.com/embed/zxMo0CZZzyg" },
{ id: "100", playlist: "Stock-010", level: "Beginner", daytaught: "Wednesday", name: "Tip it Back", choreographer: "Nathan Lee", song: "Bell Bottoms Up", artist: "Lainey Wilson", steps: "https://www.copperknob.co.uk/stepsheets/4H3QL4C/tip-it-back", teach: "https://youtube.com/embed/G4ncnot90rs", demo: "https://youtube.com/embed/Yh_Uf6M9lv4", music: "https://youtube.com/embed/z-KdDgdvoY4" },
{ id: "99", playlist: "Stock-010", level: "Beginner", daytaught: "Wednesday", name: " Footloose Cowgirl", choreographer: "Unknown", song: "Cowgirl", artist: "Parmalee", steps: "https://www.copperknob.co.uk/stepsheets/PH84DDV/footloose-cowgirl", teach: "https://youtube.com/embed/QcVk2cml_EU", demo: "https://youtube.com/embed/QcVk2cml_EU", music: "https://youtube.com/embed/4WdhENeZ5O0" },
{ id: "98", playlist: "Stock-010", level: "Beginner", daytaught: "Wednesday", name: "Boots On The Ground", choreographer: "Tre Little", song: "Boots on the Ground", artist: "803 Fresh", steps: "https://www.copperknob.co.uk/stepsheets/4GPM8ZG/boots-on-the-ground-with-clacker-fan", teach: "https://youtube.com/embed/VbZu4TcaOkw", demo: "https://youtube.com/embed/9NTpCApxBGE", music: "https://youtube.com/embed/gzZ7qP6EaSQ" },
{ id: "97", playlist: "Stock-010", level: "Beginner", daytaught: "Wednesday", name: "Cowgirls On", choreographer: "Maggie Shipley", song: "Git Yer Cowboy On", artist: "Sean Patrick McGraw", steps: "https://www.copperknob.co.uk/stepsheets/DFZD477/cowgirls-on", teach: "https://youtube.com/embed/QLBRhsYTmag", demo: "https://youtube.com/embed/QLBRhsYTmag", music: "https://youtube.com/embed/KAsjqVepSmU" },
{ id: "96", playlist: "Stock-010", level: "Intermediate", daytaught: "Wednesday", name: "Dizzy", choreographer: "Jo Thompson", song: "Dizzy", artist: "Scooter Lee", steps: "https://www.copperknob.co.uk/stepsheets/PKN9GD9/dizzy", teach: "https://youtube.com/embed/ms5q8EqHXig", demo: "https://youtube.com/embed/ms5q8EqHXig", music: "https://youtube.com/embed/IbtCPOM9_XU" },
{ id: "95", playlist: "Stock-010", level: "Beginner", daytaught: "Wednesday", name: "Just Sayin", choreographer: "John Dembiec", song: "I Aint Sayin", artist: "Jordan Davis", steps: "https://www.copperknob.co.uk/stepsheets/362WYR4/just-sayin", teach: "https://youtube.com/embed/ZAGFa4iMqTM", demo: "https://youtube.com/embed/PomUiVNHXgc", music: "https://youtube.com/embed/XI7FL4P9uvc" },
{ id: "94", playlist: "Stock-010", level: "Easy Intermediate", daytaught: "Wednesday", name: "Honky Tonkin About", choreographer: "David Interlicchia", song: "Cake", artist: "Flo Rider", steps: "https://www.copperknob.co.uk/stepsheets/PZZPF73", teach: "https://youtube.com/embed/cLfAOURjybY", demo: "https://youtube.com/embed/cLfAOURjybY", music: "https://youtube.com/embed/6Ejk7ZS8Y5U" },
{ id: "93", playlist: "Stock-010", level: "High Improver", daytaught: "Wednesday", name: "Keeping Up(Bum Me a Smoke)", choreographer: "Shellie Stone", song: "Pour Me a Drink", artist: "Malone/Shelton", steps: "https://www.copperknob.co.uk/stepsheets/L5JD5GG/keeping-up-bum-me-a-smoke", teach: "https://youtube.com/embed/t4Ev5gj2HFA", demo: "https://youtube.com/embed/2CF6_-82AN8", music: "https://youtube.com/embed/wPf4nqZZPCo" },
{ id: "92", playlist: "Stock-010", level: "High Beginner", daytaught: "Wednesday", name: "Boots on Bars", choreographer: "Sierra Gil", song: "Boots on Bars", artist: "Moonshine Bandits", steps: "https://www.copperknob.co.uk/stepsheets/Q77Z2LD/boots-on-bars", teach: "https://youtube.com/embed/yUa_xf8yS5U", demo: "https://youtube.com/embed/sDyxUXB3sL8", music: "https://youtube.com/embed/6UvEfFGKI1g" },
{ id: "91", playlist: "Stock-010", level: "Improver", daytaught: "Wednesday", name: "Up the Creek", choreographer: "Rob Fowler", song: "Creek Will Rise", artist: "Conner Smith", steps: "https://www.copperknob.co.uk/stepsheets/ZGF89PZ/up-the-creek", teach: "https://youtube.com/embed/wPtrXnYjX7U", demo: "https://youtube.com/embed/wPtrXnYjX7U", music: "https://youtube.com/embed/z97EWJ9g0ps" },

        ];

        /* ============================================
           APP STATE
           ============================================ */
        let selectedActivePlaylistGroup = null;
        let activeSearchQueryString = "";
        let activeDayFilter = "ALL";
        function setDayFilter(day) {
         activeDayFilter = day;
         renderTracks();
        }


        /* ============================================
           VENUE INITIALIZATION
           - Applies venueConfig to:
             - header title
             - search placeholder
             - email banner
             - theme colors
             - visual assets (banner, icon, background, etc.)
             - splash screen (optional)
           ============================================ */
        function initializeVenueBranding() {
            // Header title
            const headerTitleEl = document.getElementById('applicationHeaderTitle');
            if (headerTitleEl) {
                headerTitleEl.innerText = venueConfig.headerTitle || venueConfig.name || "LineDance Player";
            }

            // Search placeholder
            const searchInput = document.getElementById('danceSearchInput');
            if (searchInput) {
                searchInput.placeholder = venueConfig.searchPlaceholder || "Search dances...";
            }

            // Email banner text
            const emailBanner = document.getElementById('venueEmailBanner');
            if (emailBanner) {
                const venueName = venueConfig.name || "LineDance Player";
                const email = venueConfig.email || "";
                if (email) {
                    emailBanner.innerText = `✉ ${venueName} Feedback & Music Requests: ${email}`;
                } else {
                    emailBanner.innerText = "";
                }
            }

            // Theme colors
            if (venueConfig.theme) {
                const root = document.documentElement;
                root.style.setProperty('--brand-green', venueConfig.theme.brandGreen || '#2ecc71');
                root.style.setProperty('--dark-gray', venueConfig.theme.darkGray || '#1e1e1e');
                root.style.setProperty('--card-bg', venueConfig.theme.cardBg || '#2b2b2b');
                root.style.setProperty('--btn-blue', venueConfig.theme.buttonBlue || '#34495e');
            }

            // Background image
            if (venueConfig.assets.backgroundImageUrl) {
                document.documentElement.style.setProperty(
                    '--venue-bg-image',
                    `url(${venueConfig.assets.backgroundImageUrl})`
                );
            } else {
                document.documentElement.style.setProperty('--venue-bg-image', 'none');
            }

            // Banner image
            const bannerEl = document.getElementById('venueBanner');
            if (bannerEl) {
                if (venueConfig.assets.bannerUrl) {
                    bannerEl.src = venueConfig.assets.bannerUrl;
                    bannerEl.style.display = 'block';
                } else {
                    bannerEl.style.display = 'none';
                }
            }

            // Instructor photo
            const instructorEl = document.getElementById('venueInstructorPhoto');
            if (instructorEl) {
                if (venueConfig.assets.instructorPhotoUrl) {
                    instructorEl.src = venueConfig.assets.instructorPhotoUrl;
                    instructorEl.style.display = 'block';
                } else {
                    instructorEl.style.display = 'none';
                }
            }

            // Watermark logo
            const watermarkEl = document.getElementById('venueWatermark');
            if (watermarkEl) {
                if (venueConfig.assets.watermarkUrl) {
                    watermarkEl.src = venueConfig.assets.watermarkUrl;
                    watermarkEl.style.display = 'block';
                } else {
                    watermarkEl.style.display = 'none';
                }
            }

            // Footer text
            const footerEl = document.getElementById('venueFooter');
            if (footerEl) {
                footerEl.innerText = venueConfig.footerText || "";
            }

            // Touch icon (home screen icon)
            const touchIconEl = document.getElementById('venueTouchIcon');
            if (touchIconEl) {
                if (venueConfig.assets.touchIconUrl) {
                    touchIconEl.href = venueConfig.assets.touchIconUrl;
                } else {
                    touchIconEl.href = "";
                }
            }

            // Splash screen
            const splashEl = document.getElementById('venueSplash');
            const splashImgEl = document.getElementById('venueSplashImage');
            const splashTextEl = document.getElementById('venueSplashText');
            if (splashEl && splashImgEl && splashTextEl) {
                if (venueConfig.assets.splashImageUrl) {
                    splashImgEl.src = venueConfig.assets.splashImageUrl;
                    splashTextEl.innerText = venueConfig.headerTitle || venueConfig.name || "LineDance Player";
                    splashEl.style.display = 'flex';

                    // Hide splash after 1.5 seconds
                    setTimeout(() => {
                        splashEl.style.display = 'none';
                    }, 1500);
                } else {
                    splashEl.style.display = 'none';
                }
            }
        }

        /* ============================================
           NAVIGATION + SEARCH
           ============================================ */
        function navigateToPlaylistHubMenu() {
            selectedActivePlaylistGroup = null;
            activeSearchQueryString = "";
            document.getElementById('danceSearchInput').value = "";
            document.getElementById('navbarReturnTrigger').style.display = 'none';
            document.getElementById('applicationHeaderTitle').innerText =
                venueConfig.headerTitle || venueConfig.name || 'LineDance Player';
            renderApplicationInterface();
        }

        function openSpecificPlaylistView(groupName) {
            selectedActivePlaylistGroup = groupName;
            activeSearchQueryString = "";
            document.getElementById('danceSearchInput').value = "";
            document.getElementById('navbarReturnTrigger').style.display = 'block';
            document.getElementById('applicationHeaderTitle').innerText = groupName;
            renderApplicationInterface();
        }

        function handleLiveSearchInput() {
            const searchBox = document.getElementById('danceSearchInput');
            activeSearchQueryString = searchBox.value.toLowerCase().trim();
            if (activeSearchQueryString !== "") {
                selectedActivePlaylistGroup = null;
                document.getElementById('navbarReturnTrigger').style.display = 'block';
                document.getElementById('applicationHeaderTitle').innerText = 'Search Results';
            } else if (activeSearchQueryString === "" && selectedActivePlaylistGroup === null) {
                document.getElementById('navbarReturnTrigger').style.display = 'none';
                document.getElementById('applicationHeaderTitle').innerText =
                    venueConfig.headerTitle || venueConfig.name || 'LineDance Player';
            }
            renderApplicationInterface();
        }

        /* ============================================
           MAIN RENDER FUNCTION
           ============================================ */
        function renderApplicationInterface() {
            const viewport = document.getElementById('masterApplicationViewport');
            if (!viewport) return;
            viewport.innerHTML = '';

            // SEARCH MODE
            if (activeSearchQueryString !== "") {
                const matchedTracks = localDanceDatabase.filter(track => {
                    const danceName = (track.name || "").toLowerCase();
                    const choreographer = (track.choreographer || "").toLowerCase();
                    return danceName.includes(activeSearchQueryString) ||
                           choreographer.includes(activeSearchQueryString);
                });
                if (matchedTracks.length === 0) {
                    viewport.innerHTML =
                        '<p style="text-align:center;color:#aaa;margin-top:20px;">No matching dances found on the roster.</p>';
                    return;
                }
                renderDanceCardsList(matchedTracks, viewport);
            }
            // PLAYLIST HUB
            else if (selectedActivePlaylistGroup === null) {
                let groupNames;
                if (venueConfig.playlistGroups && venueConfig.playlistGroups.length > 0) {
                    // Use venue-defined groups
                    groupNames = [...venueConfig.playlistGroups];
                } else {
                    // Derive groups from track.group
                    groupNames = [...new Set(localDanceDatabase.map(track => track.playlist || "General"))].sort();
                }

                const grid = document.createElement('div');
                grid.className = 'playlist-selection-grid';
                groupNames.forEach(name => {
                    const count = localDanceDatabase.filter(t => t.playlist === name).length;
                    const card = document.createElement('div');
                    card.className = 'playlist-hub-card';
                    card.innerHTML = `<div>${name}</div><div class="playlist-track-counter">${count} Dances</div>`;
                    card.onclick = () => openSpecificPlaylistView(name);
                    grid.appendChild(card);
                });
                viewport.appendChild(grid);
            }
            // SPECIFIC PLAYLIST VIEW
            else {
                const filteredTracks = localDanceDatabase.filter(
                    track => track.playlist === selectedActivePlaylistGroup
                );
                renderDanceCardsList(filteredTracks, viewport);
            }
        }

        /* ============================================
           DANCE CARD RENDERING
           ============================================ */
        function renderDanceCardsList(tracksList, containerElement) {
    tracksList.forEach(track => {

        if (activeDayFilter !== "ALL" && track.daytaught !== activeDayFilter) {
            return; // skip this track
        }

        const card = document.createElement('div');
        card.className = 'dance-entry-card';

        const btnSteps = track.steps
            ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${track.steps}', '${track.name} - Steps')">Steps</button>`
            : `<button class="action-touch-btn disabled">None</button>`;

        const btnTeach = track.teach
            ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${track.teach}', '${track.name} - Teach')">Teach</button>`
            : `<button class="action-touch-btn disabled">None</button>`;

        const btnDemo = track.demo
            ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${track.demo}', '${track.name} - Demo')">Demo</button>`
            : `<button class="action-touch-btn disabled">None</button>`;

        const btnMusic = track.music
            ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${track.music}', '${track.name} - Play')">Music</button>`
            : `<button class="action-touch-btn disabled">None</button>`;

        card.innerHTML = `
            <div class="title-line">${track.name} • By: ${track.choreographer}</div>
            <div class="meta-line">Song: ${track.song} - ${track.artist} (${track.playlist})</div>
            <div class="button-bar-grid">
                ${btnSteps}
                ${btnTeach}
                ${btnDemo}
                ${btnMusic}
            </div>
        `;
        containerElement.appendChild(card);
    });
}


        /* ============================================
           OVERLAY LOGIC (STEPS + YOUTUBE)
           - Steps: CopperKnob / step sheet via <object>
           - Teach/Demo/Music: YouTube via <iframe>
           - HTTPS enforcement for YouTube
           - Sandbox permissions preserved
           ============================================ */
        function launchMediaOverlay(targetUrl, displayTitle) {
            if (!targetUrl) return;

            // Force HTTPS for YouTube and other embeds
            targetUrl = targetUrl.replace('http://', 'https://');

            const container = document.getElementById('playerOverlayFrame');
            if (!container) return;

            container.style.display = 'none';
            container.innerHTML = '';

            if (displayTitle.includes("Steps")) {
                // STEPS: use <object> for CopperKnob / step sheets
                container.innerHTML = `
                    <div class="overlay-control-header">
                        <span class="overlay-title" id="overlayPanelTitle">${displayTitle}</span>
                        <button class="done-close-btn" onclick="shutOverlayViewer()">Done</button>
                    </div>
                    <object data="${targetUrl}" class="overlay-viewport-iframe" type="text/html"></object>
                `;
            } else {
                // YOUTUBE: use <iframe> with proper sandbox + allow
                container.innerHTML = `
                    <div class="overlay-control-header">
                        <span class="overlay-title" id="overlayPanelTitle">${displayTitle}</span>
                        <button class="done-close-btn" onclick="shutOverlayViewer()">Done</button>
                    </div>
                    <iframe id="appIframeViewport"
                            class="overlay-viewport-iframe"
                            src="${targetUrl}"
                            allow="autoplay; encrypted-media; fullscreen"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox">
                    </iframe>
                `;
            }
            container.style.display = 'block';
        }

        function shutOverlayViewer() {
            const container = document.getElementById('playerOverlayFrame');
            if (container) {
                container.style.display = 'none';
                container.innerHTML = '';
            }
        }

        /* ============================================
           CACHE BUSTER RELOAD
           - Forces a fresh load of the file.
           ============================================ */
        function forceCacheBusterReload() {
            const uniqueTimestamp = new Date().getTime();
            window.location.href =
                window.location.origin + window.location.pathname + '?v=' + uniqueTimestamp;
        }

        /* ============================================
           APP BOOTSTRAP
           ============================================ */
        window.onload = function () {
            initializeVenueBranding();
            renderApplicationInterface();
        };
