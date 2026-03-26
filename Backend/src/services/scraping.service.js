import metascraper from "metascraper";
import metascraperTitle from "metascraper-title";
import metascraperImage from "metascraper-image";
import metascraperDescription from "metascraper-description";
import got from "got";

const scraper = metascraper([
  metascraperTitle(),
  metascraperImage(),
  metascraperDescription(),
]);

export async function extractMetadata(url) {
  const { body: html, url: finalUrl } = await got(url);
  const metadata = await scraper({ html, url: finalUrl });

  return metadata;
}
