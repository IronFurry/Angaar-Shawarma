require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/user");

const BRANCHES = [
  { branch: "Vasai Gaon Outlet (Main Branch)",             slug: "vasaigaon" },
  { branch: "Vasai West Outlet (Angaar Shawarma 2.0)",     slug: "vasaiwest" },
  { branch: "Nallasopara Outlet",                          slug: "nallasopara" },
  { branch: "Virar Outlet",                               slug: "virar" },
];

// ── Generate a random fallback password if the env var isn't set ────────────
// (instead of silently reusing a hardcoded default across every deploy)
const generatePassword = () => crypto.randomBytes(9).toString("base64url"); // ~12 chars

const OWNER_PASSWORD = process.env.SEED_OWNER_PASSWORD || generatePassword();
const STAFF_PASSWORD = process.env.SEED_STAFF_PASSWORD || generatePassword();

if (!process.env.SEED_OWNER_PASSWORD || !process.env.SEED_STAFF_PASSWORD) {
  console.log("⚠️  SEED_OWNER_PASSWORD and/or SEED_STAFF_PASSWORD not set in .env —");
  console.log("   generated random passwords for this run instead. Set them in");
  console.log("   server/.env to control credentials explicitly next time.\n");
}

const ADMIN_USERS = [
  { username: "owner", password: OWNER_PASSWORD, displayName: "Aryan (Owner)", role: "owner" },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  // ── Admin accounts ──────────────────────────────────────────────────────────
  console.log("── Admin Accounts ──────────────────────────────────────────────");
  for (const data of ADMIN_USERS) {
    const existing = await User.findOne({ username: data.username });
    if (existing) {
      console.log(`⚠️  '${data.username}' already exists — skipping.`);
      continue;
    }
    const user = new User({
      username: data.username,
      displayName: data.displayName,
      role: data.role,
    });
    user.password = data.password; // triggers pre-save bcrypt hook
    await user.save();
    console.log(`✅ Created ${data.role}: ${data.username}`);
  }

  // ── Per-branch staff accounts ───────────────────────────────────────────────
  console.log("\n── Staff Accounts (per branch) ─────────────────────────────────");
  for (const b of BRANCHES) {
    const username = `staff_${b.slug}`;
    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`⚠️  Staff for '${b.branch}' already exists — skipping.`);
      continue;
    }
    const user = new User({
      username,
      displayName: `Staff – ${b.branch}`,
      role: 'staff',
      branch: b.branch,
    });
    user.password = STAFF_PASSWORD; // triggers pre-save bcrypt hook
    await user.save();
    console.log(`✅ Created staff: ${username} (${b.branch})`);
  }

  console.log("\n🔐 Credentials for this run (shown once — store them somewhere safe):");
  console.log(`   owner    → username: owner     password: ${OWNER_PASSWORD}`);
  console.log(`   staff    → (all branches)      password: ${STAFF_PASSWORD}`);
  console.log("\n⚠️  Change staff passwords via the Admin Panel → Staff Accounts.");

  await mongoose.disconnect();
  console.log("\n✅ Seed complete. You can now log in.");
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});