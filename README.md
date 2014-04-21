webTechPrj
==========


Beschreibung: Für das Scrum Board werden Backbone.js und Node.js eingesetzt. 
Es ist möglich neue Tasks zu erstellen, zu editieren und zu löschen. Die Statis, sowie die geplante Zeit können mittels Dropdown verändert werden. Soll ein Text geändert werden, so reicht ein Doppelklick auf den gewünschten Bereich. Daraufhin öffnet sich ein Input-Dialog. Eine Änderung kann mittels Enter gespeichert oder mittels Esc verworfen werden.

Verwendung von Komponenten

Backbone.js: Backbone wird für das clientseitige erstellen von Model-View-Controller verwendet. Wobei in Backbone heissen diese Model-View-Collection. Dazu wurde Underscore und jQuery als Dependency verwendet.

REST API: 
 -Mittels /tasks als GET-Methode kann die Liste geladen werden.
 -Mittels /tasks als POST-Methode wird ein neuer Task angelegt.
 -Mittels /tasks/:id als PUT-Methode wird ein bestehender Task bearbeitet.
 -Mittels /tasks/:id als DELETE-Methode wird ein bestehender Task gelöscht.
