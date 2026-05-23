import { Converters } from "./../babele/script/converters.js";

const MODULE_ID = "shadowdark-rpg-br";

Hooks.on("init", () => {
  if (typeof Babele === "undefined") {
    return;
  }

  game.babele.register({
    module: MODULE_ID,
    lang: "pt-BR",
    dir: "compendium/pt-BR",
  });

  game.babele.registerConverters({
    fromPackWithCustomMapping: Converters.fromPack({
      description: "system.description",
      special: "system.damage.special",
    }),
    effectCollection: function (collection, translations) {
      for (const name in translations) {
        const effect = collection.find(
          (element) => element.name === name || element._id === name,
        );
        if (!effect) continue;
        for (const property in translations[name]) {
          effect[property] = translations[name][property];
        }
      }

      return collection;
    },
  });
});

/*
 * IMPORT ADVENTURE HOOK
 */
Hooks.on("importAdventure", async (adventure) => {
  ui.notifications.notify(
    "Importation encours ! Merci d'attendre la fin de l'importation de toutes les scènes !",
    {
      permanent: true,
    },
  );

  let updates = [];

  for (let scene of adventure.scenes) {
    let sceneId = scene._id;
    let sceneImported = game.scenes.get(sceneId);
    const { thumb } = await sceneImported.createThumbnail();
    updates.push({
      _id: scene.id,
      thumb,
    });
  }
  Scene.updateDocuments(updates);
});
