import LargestChangeFormatter from "./largest-change.formatter";
import LeastActiveFormatter from "./least-active.formatter";
import MostActiveFormatter from "./most-active.formatter";

const formatters = {
	largestChangeFormatter: new LargestChangeFormatter(),
	leastActiveFormatter: new LeastActiveFormatter(),
	mostActiveFormatter: new MostActiveFormatter(),
};

export default formatters;
