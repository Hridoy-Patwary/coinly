const handleSettingsBtnClick = () => {
    const boxData = expandBox.getBoundingClientRect();
    const innerBox = expandBox.querySelector('.exp-box-content');
    const maxPos = 150;
    
    let position = boxData.width;
    let height = boxData.height;
    let speed = 7, opacity = 0, negOpacity = 1;
    
    
    if(boxData.width < 50){
        expandBox.classList.add('active');
        let borderRadius = 50;
    
        function animate() {
            position += speed;
            height += speed;
            borderRadius -= speed - 4.25;
            opacity += (speed - 6.90);
            // borderRadius -= speed - (speed / 1.7);

            expandBox.style.width = position + 'px';
            expandBox.style.height = height + 'px';

            // if(height > (maxPos / 2)){
            //     console.log(height > (maxPos / 2))
            //     speed = 7.5
            // }


            if(opacity < 1){
                innerBox.style.opacity = opacity;
            }else{
                innerBox.style.opacity = '1';
            }
            if(borderRadius > 4){
                expandBox.style.borderRadius = borderRadius + '%';
            }
            if (position < maxPos) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }else{
        let borderRadius = 4;
        expandBox.classList.remove('active');
    
        function animate() {
            position -= speed;
            borderRadius += (speed - 4.25);
            negOpacity -= (speed - 6.90)

            expandBox.style.width = position + 'px';
            expandBox.style.height = position + 'px';
            
            if(negOpacity > 0){
                innerBox.style.opacity = negOpacity;
            }else{
                innerBox.style.opacity = '0';
            }
            if(borderRadius < 50){
                expandBox.style.borderRadius = borderRadius + '%';
            }
            if (position > 38) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }
}