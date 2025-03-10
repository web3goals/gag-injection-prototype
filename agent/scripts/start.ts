async function main() {
  console.log("Starting...");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
