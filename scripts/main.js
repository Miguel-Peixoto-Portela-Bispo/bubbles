const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const addButton = document.getElementById('add-button');
const burstNum = document.getElementById('burst-num');
const inScreenNum = document.getElementById('in-screen-num');
const totalNum = document.getElementById('total-num');
class Bubble{
    constructor(x, y, r)
    {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.speedX = ((Math.random()*4)+4)*(Math.random()<0.5?-1:1);
        this.speedY = ((Math.random()*4)+4)*(Math.random()<0.5?-1:1);
        this.minSpeedX = ((Math.random()*2)+1);
        this.minSpeedY = ((Math.random()*2)+1);
        let red = Math.floor(Math.random()*255);
        let green = Math.floor(Math.random()*255);
        let blue = Math.floor(Math.random()*255);
        this.color = `rgba(${red}, ${green}, ${blue}, 0.4)`;
    }
    update()
    {
        this.x+=this.speedX;
        this.y+=this.speedY;
        if(Math.abs(this.speedX)>this.minSpeedX)
        {
            this.speedX*=0.8;
        }
        if(Math.abs(this.speedY)>this.minSpeedY)
        {
            this.speedY*=0.8;
        }
        if(this.x-this.radius<0)
        {
            this.x = 0+this.radius;
            this.speedX*=-1;
        }
        if(this.y-this.radius<0)
        {
            this.y = 0+this.radius;
            this.speedY*=-1;
        }
        if(this.x+this.radius>canvas.width)
        {
            this.x= canvas.width-this.radius;
            this.speedX*=-1;
        }
        if(this.y+this.radius>canvas.height)
        {
            this.y = canvas.height-this.radius;
            this.speedY*=-1;
        }

    }
    render(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(Math.floor(this.x), Math.floor(this.y), this.radius, 0, Math.PI*2);
        ctx.stroke();
        ctx.fill();
    }
}
let bubbles = [new Bubble(24, 24, 24)];
addButton.onclick = ()=>{
    let radius = Math.floor(Math.random()*16)+16
    let x = (canvas.width-radius*2)*Math.random()+radius;
    let y = (canvas.height-radius*2)*Math.random()+radius;
    let b = new Bubble(x, y, radius);
    inScreenNum.innerText = Number(inScreenNum.innerText)+1;
    totalNum.innerText = Number(totalNum.innerText)+1;
    bubbles.push(b);
}
canvas.onmousemove = (e)=>
{
    let scaleX = canvas.getBoundingClientRect().width/canvas.width
    let x = (e.pageX-canvas.getBoundingClientRect().x)/scaleX;
    let scaleY = canvas.getBoundingClientRect().height/canvas.height;
    let y = (e.pageY-canvas.getBoundingClientRect().y)/scaleY;
    console.log(x, y)
    for(let i = 0;i<bubbles.length;i++)
    {
        let b = bubbles[i];
        let distance = Math.hypot(x-b.x, y-b.y);
        if(distance<=b.radius)
        {
            canvas.style.cursor = 'pointer';
            return;
        }
        else if(i>=bubbles.length-1)
        {
            canvas.style.cursor = 'default';
        }
    }
    if(bubbles.length<=0)
    {
        canvas.style.cursor = 'default';
    }
}
canvas.onclick = (e)=>{
    let scaleX = canvas.getBoundingClientRect().width/canvas.width
    let x = (e.pageX-canvas.getBoundingClientRect().x)/scaleX;
    let scaleY = canvas.getBoundingClientRect().height/canvas.height;
    let y = (e.pageY-canvas.getBoundingClientRect().y)/scaleY;
    console.log(x, y)
    for(let b of bubbles)
    {
        let distance = Math.hypot(x-b.x, y-b.y);
        console.log(distance)
        if(distance<=b.radius)
        {
            bubbles.splice(bubbles.indexOf(b), 1);
            burstNum.innerText = Number(burstNum.innerText)+1;
            inScreenNum.innerText = Number(inScreenNum.innerText)-1;
            return;
        }
    }
}
document.onkeydown = (e)=>{
    if(e.code === 'Space')
    {
        let radius = Math.floor(Math.random()*16)+16
        let x = (canvas.width-radius*2)*Math.random()+radius;
        let y = (canvas.height-radius*2)*Math.random()+radius;
        let b = new Bubble(x, y, radius);
        inScreenNum.innerText = Number(inScreenNum.innerText)+1;
        totalNum.innerText = Number(totalNum.innerText)+1;
        bubbles.push(b);
    }
}
function update()
{
    for(let b of bubbles)
    {
        b.update();
    }
}
function render()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let b of bubbles)
    {
        b.render(ctx);
    }
}
function loop()
{
    update();
    render();
    requestAnimationFrame(loop);
}
window.onload = loop;