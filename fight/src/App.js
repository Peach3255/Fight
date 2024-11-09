import React, { useState, useEffect } from 'react';
import './App.css'; // Импорт стилей

const App = () => {
  const [circles, setCircles] = useState([]); // Хранит массив кругов
  const [selectedCircles, setSelectedCircles] = useState([]); // Хранит индексы выделенных кругов
  const [isDragging, setIsDragging] = useState(false); // Указывает, происходит ли перетаскивание
  const [draggedCircleIndex, setDraggedCircleIndex] = useState(null); // Индекс перетаскиваемого круга
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Смещение курсора относительно круга

 // Функция для добавления нового круга с случайными параметрами
 const addCircle = () => {
  const slideAreaWidth = document.querySelector('.slide-area').clientWidth; // Получение ширины области слайда
  const slideAreaHeight = document.querySelector('.slide-area').clientHeight; // Получение высоты области слайда
  const sizePercentage = Math.random() * 15 + 5; // Случайный размер от 5% до 20%
  const newCircleSize = (sizePercentage / 100) * slideAreaWidth; // Размер круга в пикселях
  const newCircle = {
    id: Date.now(), // Уникальный идентификатор
    size: newCircleSize, // Размер круга
    top: Math.random() * (slideAreaHeight - newCircleSize), // Случайная позиция по вертикали
    left: Math.random() * (slideAreaWidth - newCircleSize), // Случайная позиция по горизонтали
  };
  setCircles([...circles, newCircle]); // Обновление состояния с новым кругом
};

  // Обработчик события нажатия кнопки мыши на круге
  const handleMouseDown = (index, e) => {
    if (selectedCircles.includes(index)) { // Проверка, выделен ли круг
      setIsDragging(true); // Начало перетаскивания
      setDraggedCircleIndex(index); // Установка индекса перетаскиваемого круга
      const rect = e.target.getBoundingClientRect(); // Получение размеров круга
      setOffset({
        x: e.clientX - rect.left, // Смещение по X
        y: e.clientY - rect.top, // Смещение по Y
      });
    }
  };

  // Обработчик события движения мыши для перемещения выделенных кругов
  const handleMouseMove = (e) => {
    if (isDragging && draggedCircleIndex !== null) { // Проверка на активное перетаскивание
      const newCircles = [...circles]; // Копирование массива кругов
      const slideAreaRect = document.querySelector('.slide-area').getBoundingClientRect(); // Получение размеров области

      selectedCircles.forEach(index => {
        const newTop = Math.min(Math.max(e.clientY - offset.y - slideAreaRect.top, 0), slideAreaRect.height - newCircles[index].size); // Ограничение по вертикали
        const newLeft = Math.min(Math.max(e.clientX - offset.x - slideAreaRect.left, 0), slideAreaRect.width - newCircles[index].size); // Ограничение по горизонтали
        
        newCircles[index] = {
          ...newCircles[index],
          top: newTop / slideAreaRect.height * 100, // Обновление позиции по вертикали в процентах
          left: newLeft / slideAreaRect.width * 100, // Обновление позиции по горизонтали в процентах
        };
      });

      setCircles(newCircles); // Обновление состояния с новыми позициями кругов
    }
  };

  // Обработчик события отпускания кнопки мыши
  const handleMouseUp = () => {
    setIsDragging(false); // Завершение перетаскивания
    setDraggedCircleIndex(null); // Сброс индекса перетаскиваемого круга
  };

  // Обработчик события нажатия клавиши для удаления выделенных кругов
  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && selectedCircles.length > 0) { // Проверка нажатия клавиши Backspace
      setCircles(circles.filter((_, index) => !selectedCircles.includes(index))); // Удаление выделенных кругов из состояния
      setSelectedCircles([]); // Сброс выделенных кругов
    }
  };

  // Функция для переключения выделения круга по клику
  const toggleSelectCircle = (index) => {
    if (selectedCircles.includes(index)) {
      setSelectedCircles(selectedCircles.filter(i => i !== index)); // Удаление круга из выделенных
    } else {      setSelectedCircles([...selectedCircles, index]); // Добавление круга в выделенные
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove); // Подписка на движение мыши
    window.addEventListener('mouseup', handleMouseUp); // Подписка на отпускание кнопки мыши
    window.addEventListener('keydown', handleKeyDown); // Подписка на нажатие клавиш

    return () => {
      window.removeEventListener('mousemove', handleMouseMove); // Отписка от события при размонтировании компонента
      window.removeEventListener('mouseup', handleMouseUp); // Отписка от события при размонтировании компонента
      window.removeEventListener('keydown', handleKeyDown); // Отписка от события при размонтировании компонента
    };
  }, [isDragging, draggedCircleIndex, offset, selectedCircles]);

  return (
    <div className="container">
      <button className="but" onClick={addCircle}>Добавить круг</button>
      <div className="slide-area">
        {circles.map((circle, index) => (
          <div
            key={circle.id}
            className={`circle ${selectedCircles.includes(index) ? 'selected' : ''}`} 
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              top: `${circle.top}px`,
              left: `${circle.left}px`,
            }}
            onMouseDown={(e) => handleMouseDown(index, e)} // Обработчик нажатия мыши на круге
            onClick={() => toggleSelectCircle(index)} // Обработчик клика для выделения круга
          />
        ))}
      </div>
    </div>
  );
};

export default App;
