// script.js - Modular JavaScript for AI Character Generator
// Organized into sections for better maintainability

// ====================
// Global Variables & Initialization
// ====================
let savedCharacters = JSON.parse(
  localStorage.getItem("savedCharacters") || "[]"
);
let characterEvolutionHistory = JSON.parse(
  localStorage.getItem("characterEvolutionHistory") || "{}"
);
let characterChatMemory = JSON.parse(
  localStorage.getItem("characterChatMemory") || "{}"
);
let worlds = JSON.parse(localStorage.getItem("worlds") || "[]");
let currentChatCharacter = null;

// Character Templates
const characterTemplates = {
  warrior: {
    personality: "Brave, disciplined, and protective",
    skills: "Combat expertise, weapon mastery, tactical knowledge",
    visual: "Strong build, battle scars, practical armor",
    goals: "Protect the innocent, prove their strength, find worthy opponents",
  },
  mage: {
    personality: "Intelligent, curious, and mysterious",
    skills: "Magic mastery, ancient knowledge, elemental control",
    visual: "Elegant robes, mystical artifacts, arcane symbols",
    goals:
      "Master forbidden spells, uncover ancient secrets, achieve magical immortality",
  },
  rogue: {
    personality: "Cunning, adaptable, and charming",
    skills: "Stealth, lockpicking, deception, acrobatics",
    visual: "Swift frame, dark clothing, concealed weapons",
    goals:
      "Pull off the perfect heist, build a secret network, outsmart everyone",
  },
  cleric: {
    personality: "Devout, compassionate, and wise",
    skills: "Divine magic, healing, leadership, knowledge of sacred texts",
    visual: "Holy symbols, flowing robes, kind eyes",
    goals: "Spread their faith, heal the suffering, combat darkness",
  },
  ranger: {
    personality: "Independent, observant, and patient",
    skills: "Tracking, survival, archery, animal handling",
    visual: "Weathered gear, practical clothing, keen eyes",
    goals: "Protect nature, hunt legendary beasts, live freely",
  },
  bard: {
    personality: "Charismatic, creative, and witty",
    skills: "Music, storytelling, persuasion, diplomacy",
    visual: "Colorful attire, musical instrument, expressive face",
    goals:
      "Create legendary works, influence politics through art, find true inspiration",
  },
  merchant: {
    personality: "Shrewd, persuasive, and ambitious",
    skills: "Negotiation, trade, appraisal, resource management",
    visual: "Fine clothing, calculating eyes, confident posture",
    goals:
      "Build a trading empire, acquire rare goods, become wealthy and influential",
  },
  noble: {
    personality: "Elegant, proud, and politically savvy",
    skills: "Diplomacy, etiquette, strategy, leadership",
    visual: "Refined clothing, noble bearing, expensive accessories",
    goals: "Increase family influence, rule justly, navigate court politics",
  },
};

// Style Prompts for Image Generation
const stylePrompts = {
  fantasy: "fantasy character art, magical, detailed",
  "sci-fi": "sci-fi character art, futuristic, detailed",
  realistic: "realistic portrait, detailed, high quality",
  anime: "anime character art, detailed, vibrant",
  cartoon: "cartoon character art, stylized, detailed",
  cyberpunk: "cyberpunk character art, neon, futuristic, detailed",
  steampunk: "steampunk character art, victorian, mechanical, detailed",
  medieval: "medieval character art, historical, detailed",
};

// ====================
// Utility Functions
// ====================
function getCurrentCharacter() {
  return {
    name: document.getElementById("nameInput").value,
    visual: document.getElementById("visualInput").value,
    personality: document.getElementById("personalityInput").value,
    roleplay: document.getElementById("roleplayInput").value,
    goals: document.getElementById("goalsInput").value,
    flaws: document.getElementById("flawsInput").value,
    skills: document.getElementById("skillsInput").value,
    description: document.getElementById("generatedCharacter").value,
    relationships: document.getElementById("relationshipsList").textContent,
    inventory: document.getElementById("inventoryList").textContent,
    world: document.getElementById("worldSelect")?.value || null,
  };
}

function updateLocalStorage() {
  localStorage.setItem("savedCharacters", JSON.stringify(savedCharacters));
  localStorage.setItem(
    "characterEvolutionHistory",
    JSON.stringify(characterEvolutionHistory)
  );
  localStorage.setItem(
    "characterChatMemory",
    JSON.stringify(characterChatMemory)
  );
  localStorage.setItem("worlds", JSON.stringify(worlds));
}

function showAlert(message, type = "info") {
  // Simple alert replacement; can be enhanced with a toast library
  alert(message);
}

// ====================
// Modal Management
// ====================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
}

// ====================
// Character Generation Functions
// ====================
async function generateName() {
  const origin = document.getElementById("nameOriginSelect").value;
  const prompt = `Generate a single character name with ${origin} origin. Just return the name, nothing else.`;
  try {
    document.getElementById("nameInput").value = await generateText(prompt);
  } catch (error) {
    showAlert("Error generating name: " + error.message);
  }
}

async function generateVisual() {
  const bodyType = document.getElementById("bodyTypeSelect").value;
  const prompt = `Generate a visual description for a character with ${bodyType} body type. Make it detailed and evocative. Keep it to 1-2 sentences.`;
  try {
    document.getElementById("visualInput").value = await generateText(prompt);
  } catch (error) {
    showAlert("Error generating visual: " + error.message);
  }
}

async function generatePersonality() {
  const traitType = document.getElementById("traitTypeSelect").value;
  const prompt = `Generate a personality description for a ${traitType} character. Include key traits and motivations. Keep it to 1-2 sentences.`;
  try {
    document.getElementById("personalityInput").value = await generateText(
      prompt
    );
  } catch (error) {
    showAlert("Error generating personality: " + error.message);
  }
}

async function generateBehavior() {
  const socialStyle = document.getElementById("socialStyleSelect").value;
  const prompt = `Generate roleplay behavior examples for a character who is a ${socialStyle}. Include specific mannerisms and habits. Keep it to 1-2 sentences.`;
  try {
    document.getElementById("roleplayInput").value = await generateText(prompt);
  } catch (error) {
    showAlert("Error generating behavior: " + error.message);
  }
}

async function generateExtendedAttributes() {
  const name =
    document.getElementById("nameInput").value || "Unnamed Character";
  const personality =
    document.getElementById("personalityInput").value || "Unknown personality";

  const prompts = {
    backstory: `Generate a brief but compelling backstory for ${name}, a character who is ${personality}. Keep it to 2-3 sentences.`,
    skills: `List 3-5 key skills or abilities for ${name}, a character who is ${personality}. Separate with commas.`,
    goals: `Describe 2-3 main goals or motivations for ${name}, a character who is ${personality}. Keep it to 1-2 sentences.`,
    flaws: `List 2-3 significant flaws or weaknesses for ${name}, a character who is ${personality}. Separate with commas.`,
  };

  try {
    document.getElementById("backstoryInput").value = await generateText(
      prompts.backstory
    );
    document.getElementById("skillsInput").value = await generateText(
      prompts.skills
    );
    document.getElementById("goalsInput").value = await generateText(
      prompts.goals
    );
    document.getElementById("flawsInput").value = await generateText(
      prompts.flaws
    );
  } catch (error) {
    showAlert("Error generating extended attributes: " + error.message);
  }
}

// ====================
// Stats Management
// ====================
function randomizeStats() {
  const stats = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];
  stats.forEach((stat) => {
    const value = Math.floor(Math.random() * 20) + 1;
    document.getElementById(`${stat}Stat`).value = value;
    document.getElementById(`${stat}Value`).textContent = value;
  });
}

function balanceStats() {
  const stats = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];
  stats.forEach((stat) => {
    document.getElementById(`${stat}Stat`).value = 10;
    document.getElementById(`${stat}Value`).textContent = 10;
  });
}

// ====================
// Template and Generation
// ====================
function applyTemplate() {
  const templateName = document.getElementById("templateSelect").value;
  if (!templateName || templateName === "none") return;

  const template = characterTemplates[templateName];
  if (!template) return;

  document.getElementById("personalityInput").value = template.personality;
  document.getElementById("skillsInput").value = template.skills;
  document.getElementById("visualInput").value = template.visual;
  document.getElementById("goalsInput").value = template.goals;

  // Adjust stats based on template
  const statAdjustments = {
    warrior: {
      strength: 16,
      constitution: 14,
      dexterity: 12,
      intelligence: 8,
      wisdom: 10,
      charisma: 10,
    },
    mage: {
      strength: 8,
      constitution: 10,
      dexterity: 12,
      intelligence: 16,
      wisdom: 14,
      charisma: 10,
    },
    rogue: {
      strength: 10,
      constitution: 10,
      dexterity: 16,
      intelligence: 12,
      wisdom: 10,
      charisma: 12,
    },
    cleric: {
      strength: 12,
      constitution: 12,
      dexterity: 10,
      intelligence: 12,
      wisdom: 16,
      charisma: 10,
    },
    ranger: {
      strength: 12,
      constitution: 12,
      dexterity: 14,
      intelligence: 10,
      wisdom: 14,
      charisma: 8,
    },
    bard: {
      strength: 8,
      constitution: 10,
      dexterity: 12,
      intelligence: 12,
      wisdom: 10,
      charisma: 16,
    },
    merchant: {
      strength: 10,
      constitution: 10,
      dexterity: 10,
      intelligence: 14,
      wisdom: 12,
      charisma: 14,
    },
    noble: {
      strength: 10,
      constitution: 10,
      dexterity: 12,
      intelligence: 12,
      wisdom: 12,
      charisma: 14,
    },
  };

  const adjustments = statAdjustments[templateName];
  if (adjustments) {
    Object.keys(adjustments).forEach((stat) => {
      document.getElementById(`${stat}Stat`).value = adjustments[stat];
      document.getElementById(`${stat}Value`).textContent = adjustments[stat];
    });
  }
}

function generateRandomValues() {
  const randomNames = [
    "Aelar",
    "Thrain",
    "Lyra",
    "Zephyr",
    "Kael",
    "Elara",
    "Darius",
    "Nyx",
    "Morwen",
    "Faelan",
    "Seraphina",
    "Gideon",
  ];
  const randomVisuals = [
    "Tall with silver hair and piercing blue eyes",
    "Short with fiery red hair and freckles",
    "Muscular with braided beard and intricate tattoos",
    "Slender with emerald green eyes and pointed ears",
    "Bald with weathered skin and a scarred face",
    "Graceful with long flowing black hair and amber eyes",
    "Compact build with curly brown hair and warm smile",
    "Lanky with mismatched eyes and nervous energy",
  ];
  const randomPersonalities = [
    "Brave and loyal, always putting others first",
    "Mysterious and enigmatic, with a dark past",
    "Cheerful and optimistic, seeing good in everyone",
    "Calculating and strategic, always planning ahead",
    "Reckless and impulsive, living for the moment",
    "Compassionate and empathetic, feeling others' pain deeply",
    "Sarcastic and witty, using humor as a defense",
    "Stoic and silent, speaking only when necessary",
  ];
  const randomBehaviors = [
    "Always helps those in need, even at personal cost",
    "Speaks in riddles and metaphors, never directly",
    "Has a habit of polishing their weapon when nervous",
    "Laughs loudly and often, even in inappropriate situations",
    "Stares intensely when listening, making others uncomfortable",
    "Taps fingers rhythmically when thinking",
    "Collects small trinkets from every place visited",
    "Hums ancient tunes when working on tasks",
  ];

  document.getElementById("nameInput").value =
    randomNames[Math.floor(Math.random() * randomNames.length)];
  document.getElementById("visualInput").value =
    randomVisuals[Math.floor(Math.random() * randomVisuals.length)];
  document.getElementById("personalityInput").value =
    randomPersonalities[Math.floor(Math.random() * randomPersonalities.length)];
  document.getElementById("roleplayInput").value =
    randomBehaviors[Math.floor(Math.random() * randomBehaviors.length)];

  generateExtendedAttributes();
  randomizeStats();
}

async function generateCharacter() {
  const inputs = {
    name: document.getElementById("nameInput").value,
    visual: document.getElementById("visualInput").value,
    personality: document.getElementById("personalityInput").value,
    roleplay: document.getElementById("roleplayInput").value,
    backstory: document.getElementById("backstoryInput").value,
    skills: document.getElementById("skillsInput").value,
    goals: document.getElementById("goalsInput").value,
    flaws: document.getElementById("flawsInput").value,
    style: document.getElementById("styleSelect").value,
    detail: document.getElementById("detailSelect").value,
    temperature: document.getElementById("temperatureSlider").value,
    includeRelationships: document.getElementById("includeRelationshipsCheck")
      .checked,
    includeInventory: document.getElementById("includeInventoryCheck").checked,
  };

  if (
    !inputs.name ||
    !inputs.visual ||
    !inputs.personality ||
    !inputs.roleplay
  ) {
    showAlert("Please fill in all required fields before generating");
    return;
  }

  const generateBtn = document.getElementById("generateBtn");
  generateBtn.disabled = true;
  generateBtn.textContent = "⏳ Generating...";

  try {
    const detailLevels = {
      brief: "Create a concise character profile",
      normal: "Create a detailed character profile",
      detailed: "Create an in-depth character profile",
      comprehensive:
        "Create an extremely comprehensive character profile with backstory, motivations, and relationships",
    };

    const textPrompt = `${detailLevels[inputs.detail]} with these elements:
Name: ${inputs.name}
Visual Description: ${inputs.visual}
Personality: ${inputs.personality}
Roleplay Behavior: ${inputs.roleplay}
Backstory: ${inputs.backstory || "Unknown"}
Skills: ${inputs.skills || "Not specified"}
Goals: ${inputs.goals || "Unknown"}
Flaws: ${inputs.flaws || "Not specified"}

Format the output as a cohesive character description with clear sections. Include details about the character's background, motivations, strengths, weaknesses, and relationships. The description should be engaging and suitable for roleplaying or storytelling.`;

    const characterText = await generateText({
      instruction: textPrompt,
      temperature: parseFloat(inputs.temperature),
    });
    document.getElementById("generatedCharacter").value = characterText;

    if (inputs.includeRelationships) {
      generateBtn.textContent = "⏳ Creating relationships...";
      const relationshipPrompt = `Generate 3-4 relationships for ${inputs.name}, who is ${inputs.personality}. Include relationship type (friend, rival, family, mentor, etc.) and brief description.`;
      document.getElementById("relationshipsList").textContent =
        await generateText(relationshipPrompt);
    }

    if (inputs.includeInventory) {
      generateBtn.textContent = "⏳ Creating inventory...";
      const inventoryPrompt = `Generate a list of 5-8 items that ${inputs.name}, who is ${inputs.personality} and has skills in ${inputs.skills}, would carry. Include weapons, tools, personal items, and magical items if appropriate.`;
      document.getElementById("inventoryList").textContent = await generateText(
        inventoryPrompt
      );
    }

    generateBtn.textContent = "⏳ Creating image...";
    const imagePrompt = `Digital portrait of: ${inputs.visual}. Style: ${
      stylePrompts[inputs.style]
    }, character design, high quality, professional character art.`;
    const imageUrl = await generateImage(imagePrompt);
    const imageEl = document.getElementById("characterImageEl");
    imageEl.src = imageUrl;
    imageEl.style.display = "block";
  } catch (error) {
    showAlert("Error generating character: " + error.message);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Character";
  }
}

// ====================
// Evolution and Mutation
// ====================
async function evolveCharacter() {
  if (!document.getElementById("generatedCharacter").value) {
    showAlert("Generate a character first before evolving!");
    return;
  }

  const evolveBtn = document.getElementById("evolveBtn");
  evolveBtn.disabled = true;
  evolveBtn.textContent = "⏳ Evolving...";

  try {
    const evolutionPrompt = `Based on this character description, evolve the character to a new stage of their life or development. Show how they've grown, changed, or transformed:${
      document.getElementById("generatedCharacter").value
    }`;
    const evolvedText = await generateText(evolutionPrompt);

    const characterId = document.getElementById("nameInput").value + Date.now();
    if (!characterEvolutionHistory[characterId])
      characterEvolutionHistory[characterId] = [];
    characterEvolutionHistory[characterId].push({
      previous: document.getElementById("generatedCharacter").value,
      evolved: evolvedText,
      timestamp: new Date().toISOString(),
    });
    updateLocalStorage();

    document.getElementById("generatedCharacter").value = evolvedText;
  } catch (error) {
    showAlert("Error evolving character: " + error.message);
  } finally {
    evolveBtn.disabled = false;
    evolveBtn.textContent = "🔄 Evolve Character";
  }
}

async function mutateCharacter(character, mutationType) {
  const prompt = `Mutate this character into a ${mutationType} version. Keep core traits but alter motivations, appearance, and behavior:
${character.description}`;
  return await generateText(prompt);
}

async function generateQuest(character) {
  const prompt = `Create a quest for a character with these traits:
Name: ${character.name}
Goals: ${character.goals}
Flaws: ${character.flaws}
Relationships: ${character.relationships || "None"}
Include objective, obstacles, allies, and rewards.`;
  return await generateText(prompt);
}

async function generateDialogue(character) {
  const prompt = `Generate 3 sample dialogue lines for ${character.name}, based on their personality and roleplay behavior.`;
  return await generateText(prompt);
}

function exportLoreBundle(character) {
  const bundle = {
    character,
    world: character.world || null,
    quests: character.quests || [],
    relationships: character.relationships || [],
    inventory: character.inventory || [],
  };
  const dataStr = JSON.stringify(bundle, null, 2);
  const uri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const link = document.createElement("a");
  link.setAttribute("href", uri);
  link.setAttribute("download", `${character.name}_lore_bundle.json`);
  link.click();
}

function updateChatMemory(characterId, message) {
  if (!characterChatMemory[characterId]) characterChatMemory[characterId] = [];
  characterChatMemory[characterId].push(message);
  updateLocalStorage();
}

function getMoodPrompt() {
  const mood = document.getElementById("moodSelect")?.value || "neutral";
  return `Mood: ${mood}`;
}

// ====================
// Batch Generation
// ====================
function openBatchModal() {
  openModal("batchModal");
}

function closeBatchModal() {
  closeModal("batchModal");
}

async function startBatchGeneration() {
  const count = parseInt(document.getElementById("batchCount").value);
  const theme = document.getElementById("batchTheme").value;
  const generateRelationships =
    document.getElementById("batchRelationships").checked;

  closeBatchModal();

  const batchGenerateBtn = document.getElementById("batchGenerateBtn");
  batchGenerateBtn.disabled = true;
  batchGenerateBtn.textContent = "⏳ Generating batch...";

  try {
    const batchPrompt = `Generate ${count} unique characters${
      theme ? ` for a ${theme}` : ""
    }. ${
      generateRelationships ? "Include relationships between characters." : ""
    } For each character, provide name, visual description, personality, and roleplay behavior.`;
    const batchResult = await generateText(batchPrompt);
    document.getElementById("generatedCharacter").value = batchResult;

    if (confirm("Generate images for all characters? This may take a while.")) {
      batchGenerateBtn.textContent = "⏳ Creating images...";
      const imagePrompts = batchResult
        .split("\n\n")
        .filter((section) => section.includes("Visual Description"));
      for (let prompt of imagePrompts) {
        const visualMatch = prompt.match(/Visual Description:\s*(.+)/);
        if (visualMatch) {
          const imagePrompt = `Digital portrait of: ${visualMatch[1]}. Style: ${
            stylePrompts[document.getElementById("styleSelect").value]
          }, character design, high quality.`;
          await generateImage(imagePrompt);
        }
      }
    }
  } catch (error) {
    showAlert("Error in batch generation: " + error.message);
  } finally {
    batchGenerateBtn.disabled = false;
    batchGenerateBtn.textContent = "📦 Batch Generate";
  }
}

// ====================
// Character Comparison
// ====================
function openCompareModal() {
  openModal("compareModal");
  populateCompareSelects();
}

function closeCompareModal() {
  closeModal("compareModal");
}

function populateCompareSelects() {
  const select1 = document.getElementById("compareSelect1");
  const select2 = document.getElementById("compareSelect2");

  select1.innerHTML = '<option value="">Choose character...</option>';
  select2.innerHTML = '<option value="">Choose character...</option>';

  savedCharacters.forEach((char) => {
    const option = `<option value="${char.id}">${char.name}</option>`;
    select1.innerHTML += option;
    select2.innerHTML += option;
  });
}

function compareCharacters() {
  const char1Id = parseInt(document.getElementById("compareSelect1").value);
  const char2Id = parseInt(document.getElementById("compareSelect2").value);

  if (!char1Id || !char2Id) {
    showAlert("Please select two characters to compare");
    return;
  }

  const char1 = savedCharacters.find((c) => c.id === char1Id);
  const char2 = savedCharacters.find((c) => c.id === char2Id);

  if (!char1 || !char2) return;

  const comparisonHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
            <div>
                <h3>${char1.name}</h3>
                <p><strong>Personality:</strong> ${char1.personality}</p>
                <p><strong>Visual:</strong> ${char1.visual}</p>
                <p><strong>Roleplay:</strong> ${char1.roleplay}</p>
            </div>
            <div>
                <h3>Comparison</h3>
                <p><strong>Key Differences:</strong></p>
                <ul>
                    <li>Personality styles: ${
                      char1.personality.split(",")[0]
                    } vs ${char2.personality.split(",")[0]}</li>
                    <li>Visual contrast: ${char1.visual.split(",")[0]} vs ${
    char2.visual.split(",")[0]
  }</li>
                    <li>Behavior approach: ${char1.roleplay.split(",")[0]} vs ${
    char2.roleplay.split(",")[0]
  }</li>
                </ul>
            </div>
            <div>
                <h3>${char2.name}</h3>
                <p><strong>Personality:</strong> ${char2.personality}</p>
                <p><strong>Visual:</strong> ${char2.visual}</p>
                <p><strong>Roleplay:</strong> ${char2.roleplay}</p>
            </div>
        </div>
    `;

  document.getElementById("compareResults").innerHTML = comparisonHTML;
  document.getElementById("compareResults").style.display = "block";
}

// ====================
// Chat Functionality
// ====================
function openChatModal() {
  if (!document.getElementById("nameInput").value) {
    showAlert("Please generate a character first!");
    return;
  }

  currentChatCharacter = getCurrentCharacter();
  document.getElementById("chatCharacterName").textContent =
    currentChatCharacter.name;
  document.getElementById(
    "chatMessages"
  ).innerHTML = `<div style="text-align: center; color: #7f8c8d; margin: 20px 0;">Start a conversation with ${currentChatCharacter.name}</div>`;
  openModal("chatModal");
}

function closeChatModal() {
  closeModal("chatModal");
  currentChatCharacter = null;
}

function handleChatKeypress(event) {
  if (event.key === "Enter") {
    sendChatMessage();
  }
}

async function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message || !currentChatCharacter) return;

  const messagesDiv = document.getElementById("chatMessages");
  messagesDiv.innerHTML += `<div style="margin: 10px 0;"><strong>You:</strong> ${message}</div>`;
  input.value = "";

  try {
    const chatPrompt = `You are roleplaying as ${currentChatCharacter.name}. Your personality: ${currentChatCharacter.personality}. Your backstory: ${currentChatCharacter.backstory}. The full character description: ${currentChatCharacter.description}. Respond to this message in character: "${message}"`;
    const response = await generateText(chatPrompt);
    messagesDiv.innerHTML += `<div style="margin: 10px 0;"><strong>${currentChatCharacter.name}:</strong> ${response}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    updateChatMemory(currentChatCharacter.name, {
      user: message,
      ai: response,
    });
  } catch (error) {
    messagesDiv.innerHTML += `<div style="margin: 10px 0; color: #e74c3c;"><strong>Error:</strong> Could not generate response</div>`;
  }
}

// ====================
// Gallery and Storage Management
// ====================
function filterGallery() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filterType = document.getElementById("filterSelect").value;

  let filtered = savedCharacters;

  if (searchTerm) {
    filtered = filtered.filter(
      (char) =>
        char.name.toLowerCase().includes(searchTerm) ||
        char.personality.toLowerCase().includes(searchTerm) ||
        char.visual.toLowerCase().includes(searchTerm)
    );
  }

  if (filterType !== "all") {
    if (filterType === "recent") {
      filtered = filtered.slice(0, 10);
    } else {
      filtered = filtered.filter((char) =>
        char.description.toLowerCase().includes(filterType)
      );
    }
  }

  displayFilteredGallery(filtered);
}

function displayFilteredGallery(characters) {
  const galleryCtn = document.getElementById("galleryCtn");
  const emptyGalleryMsg = document.getElementById("emptyGalleryMsg");

  galleryCtn.innerHTML = "";

  if (characters.length === 0) {
    emptyGalleryMsg.style.display = "block";
    return;
  }

  emptyGalleryMsg.style.display = "none";

  characters.forEach((char) => {
    const charEl = document.createElement("div");
    charEl.className = "gallery-item";
    charEl.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px; text-align: center;">${
              char.name
            }</div>
            <img src="${
              char.imageUrl || "https://placehold.co/150x150?text=No+Image"
            }" alt="${
      char.name
    }" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
            <div style="font-size: 0.8em; color: #7f8c8d; text-align: center;">${new Date(
              char.timestamp
            ).toLocaleDateString()}</div>
            <button class="delete-btn" data-id="${char.id}">Delete</button>
        `;

    charEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-btn")) {
        loadCharacter(char.id);
      }
    });

    galleryCtn.appendChild(charEl);
  });

  // Event delegation for delete buttons
  galleryCtn.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      deleteCharacter(parseInt(e.target.dataset.id));
    }
  });
}

function saveCharacter() {
  if (!document.getElementById("generatedCharacter").value) {
    showAlert("Generate a character first before saving!");
    return;
  }

  const stats = {
    strength: document.getElementById("strengthStat").value,
    dexterity: document.getElementById("dexterityStat").value,
    constitution: document.getElementById("constitutionStat").value,
    intelligence: document.getElementById("intelligenceStat").value,
    wisdom: document.getElementById("wisdomStat").value,
    charisma: document.getElementById("charismaStat").value,
  };

  const characterData = {
    id: Date.now(),
    name: document.getElementById("nameInput").value,
    visual: document.getElementById("visualInput").value,
    personality: document.getElementById("personalityInput").value,
    roleplay: document.getElementById("roleplayInput").value,
    backstory: document.getElementById("backstoryInput").value,
    skills: document.getElementById("skillsInput").value,
    goals: document.getElementById("goalsInput").value,
    flaws: document.getElementById("flawsInput").value,
    stats,
    description: document.getElementById("generatedCharacter").value,
    relationships: document.getElementById("relationshipsList").textContent,
    inventory: document.getElementById("inventoryList").textContent,
    imageUrl: document.getElementById("characterImageEl").src || null,
    timestamp: new Date().toISOString(),
  };

  savedCharacters.unshift(characterData);
  updateLocalStorage();
  updateGallery();
  showAlert("Character saved successfully!");
}

function loadCharacter(id) {
  const character = savedCharacters.find((c) => c.id === id);
  if (!character) return;

  document.getElementById("nameInput").value = character.name;
  document.getElementById("visualInput").value = character.visual;
  document.getElementById("personalityInput").value = character.personality;
  document.getElementById("roleplayInput").value = character.roleplay;
  document.getElementById("backstoryInput").value = character.backstory || "";
  document.getElementById("skillsInput").value = character.skills || "";
  document.getElementById("goalsInput").value = character.goals || "";
  document.getElementById("flawsInput").value = character.flaws || "";
  document.getElementById("generatedCharacter").value = character.description;

  if (character.stats) {
    Object.keys(character.stats).forEach((stat) => {
      const statEl = document.getElementById(`${stat}Stat`);
      const valueEl = document.getElementById(`${stat}Value`);
      if (statEl && valueEl) {
        statEl.value = character.stats[stat];
        valueEl.textContent = character.stats[stat];
      }
    });
  }

  if (character.relationships)
    document.getElementById("relationshipsList").textContent =
      character.relationships;
  if (character.inventory)
    document.getElementById("inventoryList").textContent = character.inventory;

  const imageEl = document.getElementById("characterImageEl");
  if (character.imageUrl) {
    imageEl.src = character.imageUrl;
    imageEl.style.display = "block";
  } else {
    imageEl.style.display = "none";
  }

  window.scrollTo(0, 0);
}

function deleteCharacter(id) {
  if (confirm("Are you sure you want to delete this character?")) {
    savedCharacters = savedCharacters.filter((c) => c.id !== id);
    updateLocalStorage();
    updateGallery();
  }
}

function updateGallery() {
  filterGallery();
}

// ====================
// Import/Export
// ====================
function exportCharacter() {
  if (!document.getElementById("generatedCharacter").value) {
    showAlert("Generate a character first before exporting!");
    return;
  }

  const stats = {
    strength: document.getElementById("strengthStat").value,
    dexterity: document.getElementById("dexterityStat").value,
    constitution: document.getElementById("constitutionStat").value,
    intelligence: document.getElementById("intelligenceStat").value,
    wisdom: document.getElementById("wisdomStat").value,
    charisma: document.getElementById("charismaStat").value,
  };

  const characterData = getCurrentCharacter();
  characterData.stats = stats;

  const format = confirm(
    "Export as JSON? Click OK for JSON, Cancel for Markdown"
  );

  if (format) {
    const dataStr = JSON.stringify(characterData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${characterData.name.replace(
      /\s+/g,
      "_"
    )}_character.json`;
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", exportFileDefaultName);
    link.click();
  } else {
    let markdown = `# ${characterData.name}\n\n`;
    markdown += `## Visual Description\n${characterData.visual}\n\n`;
    markdown += `## Personality\n${characterData.personality}\n\n`;
    markdown += `## Roleplay Behavior\n${characterData.roleplay}\n\n`;
    markdown += `## Backstory\n${
      characterData.backstory || "Not specified"
    }\n\n`;
    markdown += `## Skills & Abilities\n${
      characterData.skills || "Not specified"
    }\n\n`;
    markdown += `## Goals & Motivations\n${
      characterData.goals || "Not specified"
    }\n\n`;
    markdown += `## Flaws & Weaknesses\n${
      characterData.flaws || "Not specified"
    }\n\n`;
    markdown += `## RPG Stats\n`;
    markdown += `- Strength: ${stats.strength}\n`;
    markdown += `- Dexterity: ${stats.dexterity}\n`;
    markdown += `- Constitution: ${stats.constitution}\n`;
    markdown += `- Intelligence: ${stats.intelligence}\n`;
    markdown += `- Wisdom: ${stats.wisdom}\n`;
    markdown += `- Charisma: ${stats.charisma}\n\n`;
    markdown += `## Full Description\n${characterData.description}\n\n`;
    if (characterData.relationships)
      markdown += `## Relationships\n${characterData.relationships}\n\n`;
    if (characterData.inventory)
      markdown += `## Inventory\n${characterData.inventory}\n\n`;

    const dataStr = markdown;
    const dataUri =
      "data:text/markdown;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${characterData.name.replace(
      /\s+/g,
      "_"
    )}_character.md`;
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", exportFileDefaultName);
    link.click();
  }
}

// ... (Previous code from earlier responses remains unchanged)

// ====================
// Import/Export (Continued)
// ====================
function importCharacter(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      let characterData;
      try {
        characterData = JSON.parse(event.target.result);
      } catch (jsonError) {
        showAlert(
          "Markdown import not yet implemented. Please use JSON format."
        );
        return;
      }

      document.getElementById("personalityInput").value =
        characterData.personality || "";
      document.getElementById("roleplayInput").value =
        characterData.roleplay || "";
      document.getElementById("backstoryInput").value =
        characterData.backstory || "";
      document.getElementById("skillsInput").value = characterData.skills || "";
      document.getElementById("goalsInput").value = characterData.goals || "";
      document.getElementById("flawsInput").value = characterData.flaws || "";
      document.getElementById("generatedCharacter").value =
        characterData.description || "";

      if (characterData.stats) {
        Object.keys(characterData.stats).forEach((stat) => {
          const statEl = document.getElementById(`${stat}Stat`);
          const valueEl = document.getElementById(`${stat}Value`);
          if (statEl && valueEl) {
            statEl.value = characterData.stats[stat];
            valueEl.textContent = characterData.stats[stat];
          }
        });
      }

      if (characterData.relationships)
        document.getElementById("relationshipsList").textContent =
          characterData.relationships;
      if (characterData.inventory)
        document.getElementById("inventoryList").textContent =
          characterData.inventory;

      const imageEl = document.getElementById("characterImageEl");
      if (characterData.imageUrl) {
        imageEl.src = characterData.imageUrl;
        imageEl.style.display = "block";
      } else {
        imageEl.style.display = "none";
      }

      showAlert("Character imported successfully!");
    } catch (error) {
      showAlert("Error importing character: Invalid file format");
    }
  };
  reader.readAsText(file);
}

// ====================
// Event Listeners and Initialization
// ====================
document.addEventListener("DOMContentLoaded", () => {
  // Individual generation buttons
  document
    .getElementById("generateNameBtn")
    .addEventListener("click", generateName);
  document
    .getElementById("generateVisualBtn")
    .addEventListener("click", generateVisual);
  document
    .getElementById("generatePersonalityBtn")
    .addEventListener("click", generatePersonality);
  document
    .getElementById("generateBehaviorBtn")
    .addEventListener("click", generateBehavior);
  document
    .getElementById("generateExtendedBtn")
    .addEventListener("click", generateExtendedAttributes);

  // Stats buttons
  document
    .getElementById("randomizeStatsBtn")
    .addEventListener("click", randomizeStats);
  document
    .getElementById("balanceStatsBtn")
    .addEventListener("click", balanceStats);

  // Template and generation
  document
    .getElementById("applyTemplateBtn")
    .addEventListener("click", applyTemplate);
  document
    .getElementById("randomBtn")
    .addEventListener("click", generateRandomValues);
  document
    .getElementById("generateBtn")
    .addEventListener("click", generateCharacter);

  // Evolution and mutation
  document
    .getElementById("evolveBtn")
    .addEventListener("click", evolveCharacter);
  document.getElementById("mutateBtn").addEventListener("click", async () => {
    const mutationType = document.getElementById("mutationSelect").value;
    const mutated = await mutateCharacter(getCurrentCharacter(), mutationType);
    document.getElementById("generatedCharacter").value = mutated;
  });

  // Additional features
  document
    .getElementById("generateQuestBtn")
    .addEventListener("click", async () => {
      const quest = await generateQuest(getCurrentCharacter());
      document.getElementById("questOutput").textContent = quest;
    });

  document.getElementById("dialogueBtn").addEventListener("click", async () => {
    const dialogue = await generateDialogue(getCurrentCharacter());
    document.getElementById("dialogueOutput").textContent = dialogue;
  });

  document.getElementById("exportLoreBtn").addEventListener("click", () => {
    exportLoreBundle(getCurrentCharacter());
  });

  // Batch generation
  document
    .getElementById("batchGenerateBtn")
    .addEventListener("click", openBatchModal);

  // Comparison
  document
    .getElementById("compareBtn")
    .addEventListener("click", openCompareModal);
  document
    .getElementById("compareSelect1")
    .addEventListener("change", compareCharacters);
  document
    .getElementById("compareSelect2")
    .addEventListener("change", compareCharacters);

  // Chat
  document.getElementById("chatBtn").addEventListener("click", openChatModal);

  // Gallery and storage
  document.getElementById("saveBtn").addEventListener("click", saveCharacter);
  document
    .getElementById("exportBtn")
    .addEventListener("click", exportCharacter);
  document
    .getElementById("importBtn")
    .addEventListener("click", () =>
      document.getElementById("importFileInput").click()
    );
  document
    .getElementById("importFileInput")
    .addEventListener("change", importCharacter);

  // Search and filter
  document
    .getElementById("searchInput")
    .addEventListener("input", filterGallery);
  document
    .getElementById("filterSelect")
    .addEventListener("change", filterGallery);

  // Stats value updates
  [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ].forEach((stat) => {
    document.getElementById(`${stat}Stat`).addEventListener("input", (e) => {
      document.getElementById(`${stat}Value`).textContent = e.target.value;
    });
  });

  // Temperature slider update
  document
    .getElementById("temperatureSlider")
    .addEventListener("input", (e) => {
      document.getElementById("temperatureValue").textContent = e.target.value;
    });

  // Initialize gallery
  updateGallery();
});
