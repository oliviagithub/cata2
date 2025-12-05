import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const sleep = ms => new Promise(r => setTimeout(r, ms));
function directLink(id) { return `https://drive.google.com/uc?export=download&id=${id}`; }

async function fetchHtml(url) {
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  return text;
}

function parseFolderHtml(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const items = [];
  const nodes = [...document.querySelectorAll("[data-id]")];
  for (const n of nodes) {
    const id = n.getAttribute("data-id");
    const name = n.getAttribute("aria-label") || n.textContent || "";
    const isFolder = /folder/i.test(n.getAttribute("aria-label") || "") || n.getAttribute("data-type")==="folder";
    items.push({ id, name: name.trim(), isFolder });
  }

  let nextUrl = null;
  const nextButton = document.querySelector("[aria-label='Next page'], [data-tooltip='Next page']");
  if (nextButton) {
    const dataUrl = nextButton.getAttribute("data-pagination-url") || nextButton.getAttribute("href");
    if (dataUrl) nextUrl = new URL(dataUrl, "https://drive.google.com").toString();
  }

  return { items, nextUrl };
}

function normalizeFolderUrl(folderUrl) {
  try {
    const u = new URL(folderUrl);
    if (u.pathname.includes("/folders/")) return folderUrl;
    const m = folderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/drive/folders/${m[1]}`;
    return folderUrl;
  } catch(e) {
    return folderUrl;
  }
}

export async function getAllFiles(folderUrl) {
  const start = normalizeFolderUrl(folderUrl);
  const visitedFolders = new Set();
  const imageFiles = [];
  const queue = [start];

  while (queue.length) {
    const current = queue.shift();
    if (visitedFolders.has(current)) continue;
    visitedFolders.add(current);

    let pageUrl = current;
    while (pageUrl) {
      console.log('Leyendo:', pageUrl);
      const html = await fetchHtml(pageUrl);
      const { items, nextUrl } = parseFolderHtml(html);

      for (const it of items) {
        if (!it.id) continue;
        if (it.name && it.name.match(/\.(jpe?g|png|gif|webp|bmp)$/i)) {
          imageFiles.push({ file: it.name, id: it.id, direct: directLink(it.id) });
        } else if (it.isFolder || (!it.name || !it.name.match(/\.(jpg|png|gif|pdf|docx|xlsx)$/i))) {
          const folderUrl = `https://drive.google.com/drive/folders/${it.id}`;
          if (!visitedFolders.has(folderUrl)) queue.push(folderUrl);
        }
      }

      pageUrl = nextUrl;
      await sleep(300);
    }
  }

  const map = new Map();
  for (const f of imageFiles) {
    if (!map.has(f.id)) map.set(f.id, f);
  }
  return Array.from(map.values());
}
