export function calculateSizes({ chest, waist, shoeSize }) {
  const c = Number(chest) || 0;
  const w = Number(waist) || 0;
  const shoe = Number(shoeSize) || 0;

  let shirt;
  if (c < 86) shirt = "XS";
  else if (c < 92) shirt = "S";
  else if (c < 100) shirt = "M";
  else if (c < 108) shirt = "L";
  else if (c < 116) shirt = "XL";
  else shirt = "XXL";

  let pants;
  if (w < 68) pants = "W26";
  else if (w < 73) pants = "W28";
  else if (w < 78) pants = "W30";
  else if (w < 83) pants = "W32";
  else if (w < 88) pants = "W34";
  else pants = "W36+";

  return {
    shirt: c ? shirt : "—",
    pants: w ? pants : "—",
    shoes: shoe ? `EU ${shoe}` : "—",
  };
}
