function processQueueNonAsync(queue) {
  for (let i = 0; i < queue.length; i++) {
    processItem(queue[i]);
  }
}

function processItem(item) {
  console.log(`Processing item non async: ${item}`);
  // Logika pemrosesan item
}

async function processQueueAsync(queue) {
  for (let i = 0; i < queue.length; i++) {
    await processItemAsync(queue[i]);
  }
}

async function processItemAsync(item) {
  console.log(`Processing item async: ${item}`);
  // Logika pemrosesan item
}

const queue = [1, 2, 3, 4, 5];
processQueueAsync(queue);
processQueueNonAsync(queue);
