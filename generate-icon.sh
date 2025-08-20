#!/bin/bash

# 1. Supprimer le contenu du dossier de sortie
echo "🧹 Suppression des anciens fichiers de police..."
rm -rf ./icon-font/*

# 2. Générer à nouveau les icônes à partir du dossier SVG
echo "🎨 Génération des nouvelles icônes avec fantasticon..."
npx fantasticon --config ./fantasticon.config.cjs

echo "✅ Icônes générées avec succès dans ./icon-font"

# À la fin de generate-icon.sh
# echo "🧪 Ajout de font-weight: bold dans le CSS..."
# echo 'i[class^="lt-icon-"]:before, i[class*=" lt-icon-"]:before { font-weight: bold !important; }' >> ./icon-font/icons.css
