import { findUserIdentifier, findUserAds } from "../models/manageAdsModel.js";

export const getUserAds = async (req, res) => {
    try {
        const { id } = req.params;

        // 1️⃣ User identifier dhoondo
        const identifier = await findUserIdentifier(id);

        if (!identifier) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ User ke saare ads nikaalo
        const ads = await findUserAds(identifier);

        return res.status(200).json({
            success: true,
            identifier,
            total_ads: ads.length,
            ads,
        });
    } catch (error) {
        console.error("❌ Error fetching user ads:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
