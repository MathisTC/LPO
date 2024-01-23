/* eslint-disable */

/**
* Cette fonction permet de remplacer dans un texte en entrée les liens 
* de la forme [[lien|alias]] en <a href="...">alias</a>. 
* 
* @param text le texte brut
* @returns le texte modifié avec les liens transformés
*/
export function parseText(text) {
  const regex = /\[\[([^\|]+)\|([^\]]+)\]\]/g;
  const matches = text.matchAll(regex);
  let parts = ``;
  let lastIndex = 0;

  if (!matches) {
    return text;
  }

  for (const match of matches) {
    const [fullMatch, url, alias] = match;
    parts = parts + (text.substring(lastIndex, match.index));
    parts = parts +
      `<a href="${url}" class="text-blue-800 text-[8px] underline" target="_blank" rel="noopener noreferrer">${alias}</a>`
    lastIndex = match.index + fullMatch.length;
  }

  parts = parts + text.substring(lastIndex);
  return parts;
}
