<div class="flex flex-col min-w-60 min-h-52 border-[3px] border-solid border-black rounded-lg bg-midnight-container transition-all duration-200 hover:scale-105">
  <!--Top Row-->
  <div class="flex justify-end items-start min-h-[24px] w-full">
    <!--Status (Pinned or Deleted)-->
    <svg id="status-icon" fill="currentColor" class="pr-1 pt-1 w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path id="status-icon-path"/> <!--Dynamically set 'd' attribute through JS-->
    </svg>
  </div>

  <!--Content-->
  <div id="note-content" class="flex flex-row justify-evenly content-evenly items-center min-h-[150px] min-w-[400px] flex-wrap pl-[10px] pr-[10px] inter-light text-midnight-text"></div>
</div>