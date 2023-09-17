export function getBasePath() {
  const pathArr = Bun.main.split("/");
  pathArr.pop();
  const basePath = pathArr.join("/");
  return basePath;
}
