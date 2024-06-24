const checkNumberIsNotValid = (n) =>  {
    if (typeof n !== 'number' || n < 1) {
        throw new Error('Input must be a positive integer.');
    }
}

var sum_to_n_a = function(n) {
    checkNumberIsNotValid(n)

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    checkNumberIsNotValid(n)

    return n * (n + 1) / 2;
};

var sum_to_n_c = (function() {
    let memo = {};
    
    function sum(n) {
        checkNumberIsNotValid(n)

        if (n in memo) {
            return memo[n];
        }
        if (n === 1) {
            return 1;
        }
        let result = n + sum(n - 1);
        memo[n] = result;
        return result;
    }
    
    return sum;
})();

console.log(sum_to_n_a(5))
console.log(sum_to_n_b(5))
console.log(sum_to_n_c(5))