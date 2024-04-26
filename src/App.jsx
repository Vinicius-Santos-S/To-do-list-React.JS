import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, transform} from 'framer-motion';
import './App.css';

function App() {  
  const [toDoList, setToDoList] = useState(
    [
      {id: 0, text:"item0", color: "#ccff00"},
      {id: 1, text:"item1", color: "#ffff28"},
      {id: 2, text:"item2", color: "#ffa500"}
    ]
  )
  const [isOnFocus, setIsOnFocus] = useState({focus: false})
  const [menuState, setMenuState] = useState(false)
  const [HexValue,  setHexValue] = useState('')

  const colors = ['#ccff00', '#ffff28', '#ffa500', '#ff00ff', '#ff0080']

  const InputText = useRef(null);
  const inputHex = useRef(null);

  const pickRandomColor = () => {
    let index = Math.floor(Math.random()*colors.length)
    console.log(colors[index])
    return colors[index]
  } 

  function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor, darkColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.46) ? darkColor : lightColor;
  }
  
  const CheckMark = (props) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill={props.fill} d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
    )
  }
  
  const RevealIcon = () => {
    return(
      <div className='menu-btn'>
        <svg
          onClick={() => setMenuState(!menuState)}
          xmlns="http://www.w3.org/2000/svg"
          height="24" viewBox="0 -960 960 960"
          width="24"
          style={{
            transform: `rotate(${menuState ? '180' : '0'}deg)`
          }}
        >
          <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
        </svg>
      </div>
    )
  }

  const addItem = () => {
    if (InputText.current.value !== '' ){
      if (HexValue != ''){
        setToDoList([...toDoList, {id: toDoList.length, text: InputText.current.value, color: HexValue }])
        setHexValue('')
        inputHex.current.blur()
        inputHex.current.value = ''
      }
      else{
        setToDoList([...toDoList, {id: toDoList.length, text: InputText.current.value, color: pickRandomColor() }])
      }
      InputText.current.blur()
      InputText.current.value = ''
    } 
    
  }

  const removeItem = (id) => {
    console.log(id)
    setToDoList(toDoList.filter((item) => item.id !== id));
  }

  return (
    <div className='container'>
      <div className='container-box'>
        <h2>To-do App</h2>
        <div className='container-input'>
          <input 
            ref={InputText} 
            onFocus={() => setIsOnFocus({focus: true})}
            onBlur={() => setIsOnFocus({focus: false})}
            type="text"
            placeholder="Write something" 
            onKeyDown={
              (e) => e.key === 'Enter' && addItem()
            }
          />
          <motion.button 
            onClick={addItem}
            whileHover={{
              scale: 1.2
            }}
          >
            Submit
          </motion.button>
        </div>
        <RevealIcon/>
        <motion.div 
          className='dropdown-menu'
          animate={{
            height: menuState ? 'auto' : '0px', 
            opacity: menuState ? '100%' : '0%',
            top: menuState ? '0px' : '-40px',
            marginTop: menuState ? '8px' : '0px',
            marginBottom: menuState ? '10px' : '0px' 
          }}
        >
          <ul>
            {colors.map((color, index) => 
              <li
                key={index}
                onClick={() => setHexValue(color)} 
                style={{
                  backgroundColor: color,
                  color: pickTextColorBasedOnBgColorAdvanced(color, '#FFFFFF', '#000000')
                }}
              />
            )}
          </ul>
          <input
            ref={inputHex}
            type="text"
            placeholder='insert hex'
            onChange={(e) => setHexValue(e.target.value)} 
          />
          <div 
            style={{
              backgroundColor: HexValue
            }}
            className='preview-box'/>
        </motion.div>
      </div>
      <motion.ul className='container-list'> 
        <AnimatePresence  initial={false}>
          {toDoList.map((item) => 
            <motion.li className='list-box'
              style={{
                backgroundColor: item.color,
                color: pickTextColorBasedOnBgColorAdvanced(item.color, '#FFFFFF', '#000000')
              }}
              initial = {{ left: 100, opacity: 0 }}
              animate = {{ left: 0, opacity: 1 }}
              exit = {{ left: 100, opacity: 0 }}
              key={item.id} 
              layout
            >
              <p>
                {item.text}
              </p>
              <motion.div className='remove-btn'
                onClick={() => removeItem(item.id)}
                whileHover={{
                  scale: 1.2
                }}
              >
                <CheckMark fill={pickTextColorBasedOnBgColorAdvanced(item.color, '#FFFFFF', '#000000')}/>
              </motion.div>
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
export default App
