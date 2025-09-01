<div id="note-modal-backdrop" class="hidden inset-0 fixed flex items-center justify-center bg-black bg-opacity-50 z-50">
  <!--Modal Window-->
  <div id="note-modal-window" class="flex flex-col items-center w-[60%] h-[55%] rounded-2xl shadow-2xl gap-3 p-5 bg-midnight-bg border-2 border-midnight-secondary">
    <div class="flex flex-row justify-evenly w-[75%] h-[90%] p-12 rounded-lg bg-midnight-container">
      <!--Top Row -->
      <div class="note-top-row border-4 border-yellow-400">
        <!--Timestamp-->
        <div class="note-modal-timestamp"></div>

        <!--Pin Icon (Dynamically created in JS if applicable)-->
      </div>

      <!--Modal Body (Content Area)-->
      <textarea id="note-modal-body" class="text-center resize-none outline-none bg-midnight-container text-midnight-text"></textarea>

      <!--Actions-->
      <div class="note-bottom-row">
        <!--Edit button, recover button, etc.-->
      </div>
    </div>
  </div>
</div>

