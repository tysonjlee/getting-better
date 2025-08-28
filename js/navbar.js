/** @note Make sure each js file imports from this modal file! */

// Constants & Variables 


// Event Listeners


// Functions 
export async function injectNavBarTemplate() {
  /**
   * @brief Injects the navbar HTML into the current page 
   * @return nothing (void)
   */

  const result = await fetch("../components/navbar.tpl"); 
  const text = await result.text(); 
  const template = document.createElement("template"); 
  template.innerHTML = text.trim();  
  document.body.insertBefore(template.content.firstElementChild, document.body.firstChild);
}
