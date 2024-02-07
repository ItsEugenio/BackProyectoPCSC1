import app from "./app";
import './database'

app.listen(app.get('port'));

console.log('carga en el puerto', app.get('port'))