'use strict';

var reg;
var sub;
var isSubscribed = false;
var subscribeButton = document.querySelector('button');

if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function(reg) {
    return navigator.serviceWorker.ready;
  })
  .then(function(ServiceWorkerRegistration) {
    reg = ServiceWorkerRegistration;
    subscribeButton.disabled = false;
    console.log('Service Worker is ready!', reg);
  })
  .catch(function(error) {
    console.log('Service Worker Error: ', error);
  });
} else {
  console.log('Service Workers not supported');
}

subscribeButton.addEventListener('click', function() {
  if (isSubscribed) {
    unsubscribe();
  } else {
    subscribe();
  }
});

function subscribe() {
  // Use the `ServiceWorkerRegistration` object's `pushManager` to
  // subscribe to the messages for the `gcm_sender_id` in manifest.
  reg.pushManager.subscribe({
    userVisibleOnly: true // mandatory to show notification
  }).then(function(pushSubscription) {
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
    subscribeButton.textContent = 'Unsubscribe';
    isSubscribed = true;
  })
  .catch(function(error) {
    console.log('Boo, subscribe error...', error);
  });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {
    subscribeButton.textContent = 'Subscribe';
    console.log('Unsubscribed!', event);
    isSubscribed = false;
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
    subscribeButton.textContent = 'Subscribe';
  });
}
