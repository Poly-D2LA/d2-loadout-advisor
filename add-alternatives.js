const fs = require("fs");

// Load your JSON file
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

// Placeholder alt generator (you can customize this logic)
const generateAlt = (label, item) => {
  if (label === "Primary") return "Arbalest";
  if (label === "Energy") return "Riptide";
  if (label === "Heavy") return "Thunderlord";
  if (label === "Exotic Armour") return "Alternative Exotic";
  if (label === "Super") return "Alternative Super";
  return null;
};

// Traverse all activities and encounters
for (const activityType in data) {
  const activities = data[activityType];
  for (const activityName in activities) {
    const activity = activities[activityName];
    const encounters = activity.encounters;

    for (const encounterKey in encounters) {
      const encounter = encounters[encounterKey];
      const loadouts = encounter.loadouts;

      for (const difficulty in loadouts) {
        const roles = loadouts[difficulty];

        for (const role in roles) {
          const items = roles[role];

          roles[role] = items.map(entry => {
            if (!entry.alt) {
              return {
                ...entry,
                alt: generateAlt(entry.label, entry.item)
              };
            }
            return entry;
          });
        }
      }
    }
  }
}

// Save the updated JSON
fs.writeFileSync("data-with-alts.json", JSON.stringify(data, null, 2));
console.log("✅ data-with-alts.json created with alt loadouts.");
