# Botszerű Játékizé v1.0
Még mindig fejlesztés alatt.. de már jobb mint volt!

### Mielőtt bármihez is hozzányúlsz
Légy oly kedves és a program író programodhoz töltsd le az 'ESLint' kiterjesztést. Ez konkrétan rád erőszakolja a kódunk formátumát, szabályait, kinézetét meg mit nem. Thanks.

### Parancs létrehozása
```js
exports.run = (client, message, args) => {

  // Main

}

exports.info = {

 // Innen semmit se hagyj ki, mindegyik kell.
  name: 'Parancs(a fájl!) neve',
  syntax: 'Parancs szintaxisa(használata)',
  description: 'Parancs leírása'
  requiredPerm: null // null || 'developer' a létező permek a readme frissítésekor.
  
}
```
