function flatten(arr) {
  return arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []
  );
}

export const createElement = (type, attributes = {}, children = []) => {
  const childElements = flatten(children)
    .map(child =>
      typeof child === "string"
        ? createElement("text", { textContent: child })
        : child
    )
    .filter(child => child);

  return {
    type,
    children: childElements,
    props: Object.assign({ children: childElements }, attributes)
  };
};
