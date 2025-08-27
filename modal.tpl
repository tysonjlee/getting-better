<div id="modal-backdrop" class="hidden inset-0 fixed flex items-center justify-center bg-black bg-opacity-50 z-50">
  <!--Modal Window-->
  <div id="modal-window" class="flex flex-col items-center w-[60%] h-[55%] rounded-2xl shadow-2xl gap-3 p-5 bg-midnight-bg border-2 border-midnight-secondary">
    <!--Exit Button-->
    <div id="modal-top-actions" class="flex flex-row justify-end w-full">
      <button id="exit-button-id" class="button-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-6 h-6 text-midnight-text" fill="currentColor"><path d="M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z"/></svg>
      </button>
    </div>

    <!--Modal Title-->
    <h2 id="modal-title" class="text-3xl text-center inter-semibold text-midnight-text mb-5"></h2>

    <!--Modal Body (Content Area)-->
    <textarea id="modal-body" class="text-center w-[75%] h-[90%] p-12 resize-none rounded-lg bg-midnight-container text-midnight-text focus:outline-none"></textarea>

    <!--Save Button-->
    <div class="flex flex-row justify-end w-full">
      <button id="save-button-id" class="button-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-6 h-6 text-midnight-text" fill="currentColor"><path d="M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z"/></svg>
      </button>
    </div>
  </div>
</div>