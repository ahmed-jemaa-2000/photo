const locales = {
    en: {
        welcome: "Welcome to Clothes2Model AI! 🎨\n\nYour ID: `{id}`\nCredits: {credits}\n\n⚠️ **Note**: You currently have {credits} credits. Contact the admin to request access.",
        credits_remaining: "You have {credits} credits remaining.",
        photo_received: "Photo received! 📸\nFirst, choose the product category:",
        choose_category: "What kind of product is this?",
        choose_ethnicity: "Great! Now choose the ethnicity:",

        choose_style: "Choose a style preset:",
        choose_pose: "Select a pose:",
        choose_backdrop: "Finally, choose a background:",
        generating: "Generating your image... This may take 10-20 seconds. ⏳",
        insufficient_credits: "Insufficient credits. Please contact admin.",
        session_expired: "Session expired. Please upload the photo again.",
        result_caption: "✨ **Result Ready!**\n\n🎭 **Style**: {style}\n👤 **Model**: {gender}, {ethnicity}\n💳 **Credits**: {credits}",
        stop_success: "🛑 Session cleared. Send /start to begin again.",
        regenerating: "🔄 Regenerating with same settings... ⏳",

    },
    tn: {
        welcome: "3aslema fi Clothes2Model AI! 🎨\n\nID mte3ek: `{id}`\nSolde: {credits}\n\n⚠️ **Note**: 3andek {credits} credits tawa. Kallem l'admin bech ya3tik l'accès.",
        credits_remaining: "Mazeloulek {credits} credits.",
        photo_received: "Weslet el taswira! 📸\nAwalan, khtar chnowa el produit:",
        choose_category: "Chnowa el produit?",
        choose_ethnicity: "Behi! Tawa khtar el asl (Ethnicity):",

        choose_style: "Khtar el style mta3 el taswira:",
        choose_pose: "Khtar el wa9fa (Pose):",
        choose_backdrop: "Lekher, khtar el khalfiya (Background):",
        generating: "Qa3ed n7adher fel taswira... Osber 10-20 thanya. ⏳",
        insufficient_credits: "Ma 3andekch solde. Kallem l'admin.",
        session_expired: "Wfet el session. 3awed ab3ath el taswira.",
        result_caption: "✨ **7adhret!**\n\n🎭 **Style**: {style}\n👤 **Model**: {gender}, {ethnicity}\n💳 **Solde**: {credits}",
        regenerating: "🔄 Qa3ed n3awed n7adher... ⏳",
        regen_failed: "Fchelet el 3amaliya. Raja3nalek el credit.",
        error_no_image: "Ma fammech taswiraarja3et",
        admin_only: "⛔ Ma 3andekch el 7a9. Enti mouch admin.",
        credits_updated: "✅ Tbaddel el solde mta3 {id} walla {amount}.",
        credits_received: "🎁 El solde mte3ek walla: {amount}",
        stop_success: "🛑 Fassakhna kol chay. Ab3ath /start bech tebda men jdid.",
        stats: "📊 **Statistiques**\n\n👥 Total Utilisateurs: `{users}`\n🖼️ Total Tasawer: `{gens}`",
        help: "📚 **Kifech Testa3mel**\n\n1. 📸 **Ab3ath Taswira**: Ab3ath taswira wadh7a mta3 el 7wayej.\n2. 🎨 **Khtar**: Khtar el Genre, Asl, Style, Wa9fa, w Khalfiya.\n3. ✨ **Estanna**: El taswira ta7dher fi ~15 thanya.\n\n**Commandes**:\n/profile - Chouf el profil mte3ek\n/lang - Baddel el lougha\n/stop - Fassakh el session\n/help - Warri el guide hedha",

        profile: "👤 **Profil**\n\n🆔 ID: `{id}`\n💳 Solde: `{credits}`\n🖼️ Tasawer: `{gens}`",
        gift_success: "✅ 3tit {amount} credits lel user {id}.",
        gift_received: "🎁 Jek cadeau {amount} credits! Sa77a! 🎉",
        broadcast_sent: "✅ El message wsol l {count} users.",
        buttons: {
            female: "Mra 👩",
            male: "Rajel 👨",
            tunisian: "Tounsi 🇹🇳",
            european: "European 🇪🇺",
            regenerate: "🔄 3awed",
            clothes: "7wayej 👕",
            shoes: "Sabbat 👟"
        }

    }
};


module.exports = locales;
