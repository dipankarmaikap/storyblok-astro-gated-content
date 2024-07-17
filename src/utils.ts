export const isPreview = import.meta.env.STORYBLOK_IS_PREVIEW === "yes";

export function handelFormSubmit(formName: string) {
  const errorMessageElement = document.getElementById("form-error")!;
  const form = document.getElementById(formName);

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessageElement.innerText = "";
    const formElement = e.target as HTMLFormElement;
    const response = await fetch(formElement.action, {
      method: formElement.method,
      body: new FormData(formElement),
    });
    const data = await response.json();
    if (data.sucess) {
      window.location.href = "/";
    } else {
      errorMessageElement.innerText = data.error;
    }
  });
}
