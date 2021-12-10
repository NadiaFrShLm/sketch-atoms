const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080], //разрешение экрана длч инстаграмма
  animate: true             //запуск анимиции
};

const sketch = ({ context, width, height }) => {
  const agents = []; //пустой array для точек

  for (let i = 0; i < 50; i++) { //40 точек
    const x = random.range(0, width);
    const y = random.range(0, height);
    //нa каждом круге в array добавляется точка с рандомными координатами
    agents.push(new Agent(x, y))
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // соединение точек
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]; //одна точка из array

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];//остальные точки из array

        const dist = agent.pos.getDistance(other.pos);
        if (dist > 170) continue; //если растояине >200 игнорировать последующий код

        //линия толще если точки близко др к др
        //(растояние, MIN растояние, MAX растояние, толщинаЛинии,толщинаЛинии)
        context.lineWidth = math.mapRange(dist, 0, 170, 5, 0.1)

        //создаем линию соединения точек
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);//начало соединительной линии
        context.lineTo(other.pos.x, other.pos.y);//конец соединительной линии
        context.stroke();
      }
    }
    agents.forEach(agent => { //для каждой точки в ARRAY
      agent.update();         //запуск функции изменения позиции
      agent.draw(context);
      agent.bounce(width, height); //запуск функции отскока от краев рамки
    });
  };
};

canvasSketch(sketch, settings);


// конструктор для точки
class Vector {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
  }
  getDistance(v) { //определение растояния м/у точками
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
const getRndColor = () => { //функция рандомного цвета
  var r = 255 * Math.random() | 0,
    g = 255 * Math.random() | 0,
    b = 255 * Math.random() | 0;
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

class Agent {
  constructor(x, y, color) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 4), random.range(-1, 4))//скорость
    this.radius = random.range(4, 15);
    this.color = getRndColor();
  }


  bounce(width, height) { //функция отскока от краев рамки
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  update() { //функция изменения позиции (анимация)
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) { //функция рисования круга
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = ".5" //толщина линии

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color; //рандомный цвет заливки
    context.shadowBlur = 10;
    context.shadowColor = this.color;
    context.fill();   //заливка белым
    context.stroke(); //обводка

    context.restore();
  }

}
