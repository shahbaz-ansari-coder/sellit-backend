import { findUserIdentifier, findUserAds, deleteUserAdModel, countAllAds, getAllRecentAdsFromTables, getSingleAdModel, findSearchedAds } from "../models/manageAdsModel.js";

const subCategoryGroups = {
    mobile_ads: [
        "Mobile Phones",
        "Tablets",
        "Accessories"
    ],

    motors_ads: [
        "Cars",
        "Cars Accessories",
        "Spare Parts",
        "Buses, Vans & Trucks",
        "Rickshaw & Chingchi",
        "Tractors & Trailers",
        "Boats",
        "Other Vehicles"
    ],

    property_ads: [
        "Houses",
        "Plots",
        "Flats",
        "Commercial",
        "Farm Houses",
        "Rooms",
        "Other Property"
    ],

    property_rent_ads: [
        "Houses for Rent",
        "Flats for Rent",
        "Commercial for Rent",
        "Rooms for Rent",
        "Portions & Floors for Rent",
        "Vacation Rentals",
        "Other Property for Rent"
    ],

    electronics_ads: [
        "Computers & Accessories",
        "TV - Home Audio & Video",
        "Cameras & Accessories",
        "Games & Entertainment",
        "Other Home Appliances",
        "Kitchen Appliances",
        "AC & Coolers",
        "Washing Machines & Dryers",
        "Generators, UPS & Power Solutions",
        "Solar Panels & Inverters"
    ],

    bike_ads: [
        "Motorcycles",
        "Scooters",
        "Spare Parts",
        "Bicycles",
        "ATV & Quads",
        "Other Bikes"
    ],

    job_ads: [
        "Accounting & Finance",
        "Administration",
        "Advertising & PR",
        "Architecture & Design",
        "Customer Service",
        "Education",
        "Engineering",
        "Healthcare",
        "Human Resources",
        "IT & Telecom",
        "Manufacturing",
        "Marketing & Communications",
        "Sales",
        "Other Jobs"
    ],

    animal_ads: [
        "Birds",
        "Cats",
        "Dogs",
        "Fish & Aquariums",
        "Horses",
        "Livestock",
        "Other Animals"
    ],

    furniture_ads: [
        "Sofa & Chairs",
        "Beds & Wardrobes",
        "Home Decoration",
        "Tables & Dining",
        "Office Furniture",
        "Other Household Items"
    ],

    fashion_ads: [
        "Clothes",
        "Footwear",
        "Watches",
        "Jewellery",
        "Sunglasses",
        "Bags & Luggage",
        "Wedding",
        "Skin & Hair",
        "Makeup",
        "Perfumes",
        "Other Fashion"
    ],

    books_sports_ads: [
        "Books & Magazines",
        "Musical Instruments",
        "Sports Equipment",
        "Gym & Fitness",
        "Other Hobbies"
    ],

    kids_ads: [
        "Kids Furniture",
        "Toys & Games",
        "Prams & Walkers",
        "Swings & Bouncers",
        "Car Seats",
        "Kids Bikes & Scooters",
        "Kids Accessories",
        "Kids Clothing",
        "Other Kids Items"
    ]
};

export const getTableBySubcategory = (subcat) => {
    for (const table in subCategoryGroups) {
        if (subCategoryGroups[table].includes(subcat)) {
            return table;
        }
    }
    return null; // Not found
  };

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

export const getAllRecentAds = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 18;
        const offset = (page - 1) * limit;

        const totalAds = await countAllAds();

        const ads = await getAllRecentAdsFromTables(limit, offset);

        return res.status(200).json({
            success: true,
            total_ads: totalAds,
            page,
            total_pages: Math.ceil(totalAds / limit),
            ads_per_page: limit,
            ads
        });

    } catch (error) {
        console.error("❌ Error fetching recent ads:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteUserAd = async (req, res) => {
    try {
        const { subcategory, id } = req.params;

        // 1️⃣ Convert sub-category → table name
        const table = getTableBySubcategory(subcategory);

        if (!table) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategory",
            });
        }

        // 2️⃣ Delete ad from correct table
        const deleted = await deleteUserAdModel(table, id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Ad not found or already deleted",
            });
        }

        // 3️⃣ Success Response
        return res.status(200).json({
            success: true,
            message: "Ad deleted successfully",
            subcategory,
            table
        });

    } catch (error) {
        console.error("❌ Error deleting ad:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSingleAd = async (req, res) => {
    try {
        const { table, id } = req.params;

        if (!table || !id) {
            return res.status(400).json({
                success: false,
                message: "Table name and ID are required",
            });
        }

        // Fetch ad from dynamic table
        const ad = await getSingleAdModel(table, id);

        if (!ad) {
            return res.status(404).json({
                success: false,
                message: "Ad not found",
            });
        }

        return res.status(200).json({
            success: true,
            ad,
        });

    } catch (error) {
        console.error("❌ Error fetching single ad:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const searchAds = async (req, res) => {
    try {
        const { text = "", location = "All Pakistan" } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const { ads, total } = await findSearchedAds(text, location, limit, offset);

        return res.status(200).json({
            success: true,
            total_ads: total,
            page,
            total_pages: Math.ceil(total / limit),
            ads,
        });

    } catch (error) {
        console.error("❌ Search Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
