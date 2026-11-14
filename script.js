async function chargerCabinets() {
        const conteneur = document.getElementById("cabinets");

        try {
            const reponse = await fetch("cabinets.txt", { cache: "no-cache" });
            if (!reponse.ok) throw new Error("Fichier introuvable");
            const texte = await reponse.text();

            const lignes = texte
                .split("\n")
                .map(l => l.trim())
                .filter(l => l && !l.startsWith("#"));

            lignes.forEach(ligne => {
                const [ville, adresse, jours, horaires, lien] =
                    ligne.split("|").map(p => p.trim());

                if (!ville || !adresse) return; // ligne incomplète

                const cabinet = document.createElement("div");
                cabinet.className = "cabinet";

                // Adresse
                const blocAdresse = document.createElement("div");
                blocAdresse.className = "cabinet-adresse";
                const strong = document.createElement("strong");
                strong.textContent = ville;
                blocAdresse.append(strong, adresse);

                // Horaires
                const blocHoraires = document.createElement("div");
                blocHoraires.className = "cabinet-horaires";
                blocHoraires.append(jours || "", document.createElement("br"), horaires || "");

                cabinet.append(blocAdresse, blocHoraires);

                // Bouton (seulement si le lien est valide)
                if (lien && lien.startsWith("https://")) {
                    const bouton = document.createElement("a");
                    bouton.href = lien;
                    bouton.className = "bouton";
                    bouton.textContent = "Prendre RDV";
                    cabinet.append(bouton);
                }

                conteneur.append(cabinet);
            });
        } catch (e) {
            conteneur.textContent = "Les informations des cabinets sont momentanément indisponibles.";
            console.error(e);
        }
    }

    chargerCabinets();


    // L'adresse est coupée en morceaux pour ne pas apparaître en clair dans le code
    const partieLocale = ["mon", "adresse", "mail"].join("_");
    const domaine = ["qqchose", "com"].join(".");
    const adresse = partieLocale + "@" + domaine;

    const bouton = document.getElementById("mail");
    bouton.textContent = adresse;

    bouton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(adresse);
            bouton.textContent = "Adresse copiée ✔";
        } catch (e) {
            // Solution de secours : ouvrir le client mail
            window.location.href = "mailto:" + adresse;
            return;
        }
        setTimeout(() => { bouton.textContent = adresse; }, 2000);
    });