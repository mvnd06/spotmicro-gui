const createStatusBar = () => {
    const statusBar = document.createElement('div');
    statusBar.classList.add('status-bar');
  
    const services = [
      { name: 'motion', status: false },
      { name: 'display', status: false },
      { name: 'gui', status: false },
    ];
  
    const serviceStatus = services.map((service) => {
      const serviceElem = document.createElement('div');
      serviceElem.classList.add('service');
  
      const serviceCircle = document.createElement('div');
      serviceCircle.classList.add('service-circle');
      serviceCircle.classList.add(service.status ? 'service-circle-green' : 'service-circle-red');
      serviceElem.appendChild(serviceCircle);
  
      const serviceName = document.createElement('div');
      serviceName.classList.add('service-name');
      serviceName.textContent = service.name;
      serviceElem.appendChild(serviceName);
  
      return serviceElem;
    });
  
    serviceStatus.forEach((serviceElem) => statusBar.appendChild(serviceElem));
  
    setInterval(() => {
      axios.get('/status')
        .then((response) => {
          const data = response.data;
          serviceStatus.forEach((serviceElem, index) => {
            const status = data[services[index].name];
            const circleClass = status ? 'service-circle-green' : 'service-circle-red';
            const circle = serviceElem.querySelector('.service-circle');
            circle.classList.remove('service-circle-green', 'service-circle-red');
            circle.classList.add(circleClass);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }, 5000);
  
    return statusBar;
  };
  
  module.exports = createStatusBar;
  