import { task } from 'hardhat/config';
import { deploy } from './deploy';

task('deploy', 'Deploy Seacows Contracts').addParam('env', 'The env of Seacows Protocol to deploy').setAction(deploy);
