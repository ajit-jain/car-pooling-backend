// var Observable =require('@reactivex/rxjs').Observable;

// abc =Observable.interval(1000);
// // abc.subscribe((value)=>{
// //     console.log("value:",value);
// // })
// var a=10;
// var obj={
//     a
// }
// console.log(Object.keys(obj));


process.nextTick(()=>{console.log(30)});           
console.log(40);
setTimeout(()=>{console.log(20)},0)