import { findUserIdentifier, findUserAds, deleteUserAdModel } from "../models/manageAdsModel.js";

// ---------------------------------------------------------
// 📌 CATEGORY → TABLE MAP FUNCTION (same file as controller)
// ---------------------------------------------------------
const categoryToTable = (category) => {
    const map = {
        mobile: "mobile_ads",
        motors: "motors_ads",
        property: "property_ads",
        kids: "kids_ads",
        rent: "property_rent_ads",
        bikes: "bike_ads",
        electronics: "electronics_ads",
        animals: "animal_ads",
        fashion: "fashion_ads",
        books_sports: "books_sports_ads",
        furniture: "furniture_ads",
    };

    return map[category] || null;
};

// ---------------------------------------------------------
// 📌 GET ALL ADS OF A USER
// ---------------------------------------------------------
export const getUserAds = async (req, res) => {
    try {
        const { id } = req.params;

        // 1) Find user identifier
        const identifier = await findUserIdentifier(id);

        if (!identifier) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2) Find ads
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

// ---------------------------------------------------------
// 📌 DELETE USER AD
// ---------------------------------------------------------
export const deleteUserAd = async (req, res) => {
    try {
        const { category, id } = req.params;

        // Convert category to table name
        const table = categoryToTable(category);

        if (!table) {
            return res.status(400).json({
                success: false,
                message: "Invalid category",
            });
        }

        // Delete ad from correct table
        const deleted = await deleteUserAdModel(table, id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Ad not found or already deleted",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ad deleted successfully",
            category,
            table
        });

    } catch (error) {
        console.error("❌ Error deleting ad:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
