var Observable =require('@reactivex/rxjs').Observable;

abc =Observable.interval(1000);
// abc.subscribe((value)=>{
//     console.log("value:",value);
// })
var a=10;
var obj={
    a
}
console.log(Object.keys(obj));