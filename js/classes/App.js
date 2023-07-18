import { getDptos} from '../fetchApiMetodos.js'
class ApiGestorDptos{
    constructor(){
        this.initProgram();
    }
    
    initProgram(){
        getDptos();

    }
}

export default ApiGestorDptos;