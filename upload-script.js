// upload-script.js
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// .env または .env.local を読み込む
dotenv.config({ path: '.env.local' }); 
dotenv.config(); 

const apiKey = process.env.GOOGLE_API_KEY; 
if (!apiKey) {
    console.error("❌ エラー: APIキーが見つかりません");
    process.exit(1);
}

const fileManager = new GoogleAIFileManager(apiKey);
const storageDir = path.join(__dirname, "pdf_storage");

async function uploadAll() {
  console.log("🚀 pdf_storage フォルダ内のPDFをアップロードします...");

  if (!fs.existsSync(storageDir)) {
      console.error(`❌ エラー: ${storageDir} が見つかりません。`);
      return;
  }

  const files = fs.readdirSync(storageDir).filter(file => file.toLowerCase().endsWith(".pdf"));

  if (files.length === 0) {
      console.log("⚠️ PDFファイルが見つかりませんでした。");
      return;
  }

  console.log(`📄 対象ファイル数: ${files.length}件\n`);
  console.log("▼▼▼ 下記の出力結果をコードにコピペしてください ▼▼▼\n");

  for (const file of files) {
    const filePath = path.join(storageDir, file);
    try {
      const uploadResponse = await fileManager.uploadFile(filePath, {
        mimeType: "application/pdf",
        displayName: file,
      });
      console.log(`{ uri: "${uploadResponse.file.uri}", mimeType: "application/pdf" }, // ${file}`);
    } catch (error) {
      console.error(`❌ 失敗 (${file}):`, error.message);
    }
  }
  console.log("\n▲▲▲ コピー範囲終了 ▲▲▲");
}

uploadAll();