import React,{Component,ReactNode,ErrorInfo} from "react";

interface IErrorBoundaryProps {
  children: ReactNode
}

interface IErrorBoundaryState{
  hasError:boolean
}

class ErrorBoundary extends Component<IErrorBoundaryProps,IErrorBoundaryState>{
  constructor(props:IErrorBoundaryProps){
    super(props);
    this.state= { hasError:false };
  }

  static getDerivedStateFromError(_:Error):IErrorBoundaryState{
    return{ hasError : true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
      console.error('ErrorBoundary caught an error',error,errorInfo);
  }

  render(): ReactNode {
      if(this.state.hasError){
        return(
          <div className="flex items-center justify-center h-screen text-center text-lg text-red-600">
            ! An error occurred.Please try again later.
          </div>
        )
      }
      return this.props.children;
  }
}

export default ErrorBoundary;