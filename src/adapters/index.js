import tampere from '../adapters/tampere';
import helsinki from '../adapters/helsinki';
import newyork from '../adapters/newyork';
import massachusetts from '../adapters/massachusetts';
import sanfranciscoMuni from '../adapters/sanfrancisco-muni';
import chicago from '../adapters/chicago';
import alameda from '../adapters/alameda';
import toronto from '../adapters/toronto';

// List all enabled adapters here
const adapters = {
    tampere,
    helsinki,
    newyork,
    massachusetts,
    'sanfrancisco-muni': sanfranciscoMuni,
    chicago,
    alameda,
    toronto
};

export default adapters;
