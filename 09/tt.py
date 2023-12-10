lines = open('input').read().split('\n')
nums = [list(map(int,line.split())) for line in lines]

def red(nums):
    nn = [b-a for a,b in zip(nums,nums[1:])]
    return nums[-1] + red(nn) if any(nn) else nums[-1]

print('part 1:', sum(map(red,nums)))
print('part 2:', sum(red(num[::-1]) for num in nums))