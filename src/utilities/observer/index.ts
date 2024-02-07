export function observer(itemId: number): Promise<HTMLDivElement> {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const component = document.querySelector(`[data-id="${itemId}"]`);
          if (component) {
            observer.disconnect(); // Stop observing once the component is found
            resolve(component as HTMLDivElement); // Resolve the promise with the 'top' value
          }

          break;
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect(); // Ensure to clean up if not found
      reject(
        new Error(
          "Component with specified data-id " + itemId + " was not found",
        ),
      );
    }, 2000); // Adjust time limit as necessary
  });
}

// `[data-id="${itemId}"]:not([oldComponent="true"])`,
