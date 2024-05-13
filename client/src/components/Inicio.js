const Inicio = () => {
    return (
        <div className="grid grid-nogutter surface-0 text-800">
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
            <section>
                <span className="block text-6xl font-bold mb-1">Te damos la bienvenida</span>
                <div className="text-6xl text-primary font-bold mb-3">al sistema de horarios</div>
                <p className="mt-0 mb-4 text-700 line-height-3">Bienvenido al sistema de horarios de nuestra universidad, diseñado para optimizar tu experiencia académica. Nuestro sistema te permite acceder fácilmente a los horarios de clases, talleres y actividades extracurriculares.</p>
            </section>
        </div>
        <div className="col-12 md:col-6 overflow-hidden mt-2" style={{ height: 'calc(100vh - 20vh)' }}>
            <img src="https://gaceta.uabc.mx/sites/default/files/styles/max_1300x1300/public/2022-02/Banco%20de%20im%C3%A1genes.jpg?itok=vkpnMN07" alt="hero-1" className="w-full h-full object-cover" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
        </div>
        </div>  
    )
}

export default Inicio
