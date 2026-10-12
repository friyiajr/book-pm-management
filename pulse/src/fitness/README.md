# York U Fitness prototype

York mode opens the original health dashboard by default. A new Progress tab in the existing desktop and mobile navigation opens the responsive fitness progress screen; Dashboard, Log, History, and Summary keep their original behavior. The progress screen has a locally scoped light theme, without replacing the app theme or global CSS. Pulse mode keeps its original navigation and health tracker. No backend, wearable integration, or network data service is used.

Demo settings switches between Alex and Sam; both start with zero workouts and no goal. Generated starter workouts from older versions are removed on load while real logged workouts are preserved. A confirmed reset action clears the selected demo profile. Browser storage is scoped by profile; logging always stamps the active profile's ownership and reads filter by that ownership. This simulates profile isolation for demo purposes. It is not authentication or a security boundary: anyone with access to this browser or its developer tools can access its local storage. Use fictional data.

One active goal can be written in the user’s own words: a personal milestone with a manual completion action, a numeric target with custom units and manually updated current progress, or an automatically tracked weekly workout count. Existing numeric weekly goals migrate on load without replacing workouts. Numeric and milestone goals do not reset each week. Weeks start Monday in local time. Multiple workouts in a day each count toward totals and goals, while streaks count unique consecutive active days. Yesterday's streak remains active until the end of today. All workouts remain available in My workouts, with solo and class filters.

Checks: `node --test src/fitness/*.test.js`, `npm run build:yorku`, and `npm run build`. Browser demo checks cover workout logging with immediate updates, profile switching, empty state, and a 390px mobile viewport.

Pilot success thresholds are evaluation criteria for a future measured pilot; this prototype does not send analytics or claim pilot outcomes.
